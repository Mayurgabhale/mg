
exports.getTimeTravelOccupancy = async (req, res) => {
  try {
    const datetime = req.query.datetime;
    const location = req.query.location || null;

    if (!datetime) {
      return res.status(400).json({ success: false, message: 'query param "datetime" required (ISO format like 2025-11-04T23:50:00)' });
    }

    // Validate format strictly: YYYY-MM-DDTHH:mm:ss (optional fractional seconds allowed)
    const isoNoTZ = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?$/;
    if (!isoNoTZ.test(datetime)) {
      return res.status(400).json({
        success: false,
        message: 'invalid datetime. Use ISO format WITHOUT timezone offset, e.g. 2025-11-04T23:50:00'
      });
    }

    // fetch the snapshot (last swipe per person <= the literal datetime string)
    const swipes = await service.fetchTimeTravelOccupancy(datetime, location);

    const summary = { total: 0, Employee: 0, Contractor: 0 };
    const partitions = {};
    const unmappedDoors = new Set();

    swipes.forEach(r => {
      const rawFloor = lookupFloor(r.PartitionName2, r.Door, r.Direction, unmappedDoors);
      const floorNorm = rawFloor ? String(rawFloor).trim().toLowerCase() : '';

      if (floorNorm === 'out of office') return;

      summary.total++;
      if (isEmployeeType(r.PersonnelType)) summary.Employee++;
      else summary.Contractor++;

      if (!location) {
        const p = r.PartitionName2;
        if (!partitions[p]) partitions[p] = { total: 0, Employee: 0, Contractor: 0, floors: {} };
        partitions[p].total++;
        if (isEmployeeType(r.PersonnelType)) partitions[p].Employee++;
        else partitions[p].Contractor++;

        const floorLabel = rawFloor ? String(rawFloor).trim() : 'Unmapped';
        partitions[p].floors[floorLabel] = (partitions[p].floors[floorLabel] || 0) + 1;
      }
    });

    if (unmappedDoors.size) {
      console.warn('TimeTravel - Unmapped doors:\n' + Array.from(unmappedDoors).join('\n'));
    }

    const details = swipes
      .map(r => {
        const rawFloor = lookupFloor(r.PartitionName2, r.Door, r.Direction, unmappedDoors);
        const floor = rawFloor ? String(rawFloor).trim() : null;
        return { ...r, Floor: floor };
      })
      .filter(d => {
        const f = d.Floor;
        return !(f && String(f).trim().toLowerCase() === 'out of office');
      });

    // IMPORTANT: return the exact datetime string the user sent — no toISOString() conversion
    return res.json({
      success: true,
      datetime: datetime,        // <<-- exact literal sent by client
      summary,
      partitions: location ? undefined : partitions,
      details
    });
  } catch (err) {
    console.error('TimeTravel error', err);
    return res.status(500).json({ success: false, message: 'TimeTravel occupancy failed' });
  }
};




....

exports.fetchTimeTravelOccupancy = async (datetimeISO, location = null) => {
  const pool = await poolPromise;
  const partitionsSql = partitionList.map(p => `'${p.replace("'", "''")}'`).join(',');

  const locationFilter = location
    ? `AND t1.PartitionName2 = @location`
    : `AND t1.PartitionName2 IN (${partitionsSql})`;

  const query = `
    WITH AllSwipes AS (
      SELECT
        DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
        t1.ObjectName1,
        t1.ObjectName2       AS Door,
        CASE
          WHEN t3.Name IN ('Contractor','Terminated Contractor') THEN t2.Text12
          ELSE CAST(t2.Int1 AS NVARCHAR)
        END                   AS EmployeeID,
        t2.text5             AS Text5,
        t1.PartitionName2    AS PartitionName2,
        t1.ObjectIdentity1   AS PersonGUID,
        t3.Name              AS PersonnelType,
        t2.Text4             AS CompanyName,
        t2.Text5             AS PrimaryLocation,
        COALESCE(
          TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID/Card)[1]','varchar(50)'),
          TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID)[1]','varchar(50)'),
          sc.value
        )                     AS CardNumber,
        t5a.value            AS AdmitCode,
        t5d.value            AS Direction,
        CONVERT(DATETIME2, DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC)) AS LT
      FROM [ACVSUJournal_00011029].[dbo].[ACVSUJournalLog] AS t1
      LEFT JOIN [ACVSCore].[Access].[Personnel]     AS t2
        ON t1.ObjectIdentity1 = t2.GUID
      LEFT JOIN [ACVSCore].[Access].[PersonnelType] AS t3
        ON t2.PersonnelTypeId = t3.ObjectID
      LEFT JOIN [ACVSUJournal_00011029].[dbo].[ACVSUJournalLogxmlShred] AS t5a
        ON t1.XmlGUID = t5a.GUID AND t5a.Name = 'AdmitCode'
      LEFT JOIN [ACVSUJournal_00011029].[dbo].[ACVSUJournalLogxmlShred] AS t5d
        ON t1.XmlGUID = t5d.GUID AND t5d.Value IN ('InDirection','OutDirection')
      LEFT JOIN [ACVSUJournal_00011029].[dbo].[ACVSUJournalLogxml] AS t_xml
        ON t1.XmlGUID = t_xml.GUID
      LEFT JOIN (
        SELECT GUID, value
        FROM [ACVSUJournal_00011029].[dbo].[ACVSUJournalLogxmlShred]
        WHERE Name IN ('Card','CHUID')
      ) AS sc
        ON t1.XmlGUID = sc.GUID
      WHERE
        t1.MessageType = 'CardAdmitted'
        ${locationFilter}
        AND DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC)
            <= TRY_CAST(@dt AS DATETIME2)
    ),
    LastPerPerson AS (
      SELECT *,
        ROW_NUMBER() OVER (PARTITION BY PersonGUID ORDER BY LT DESC) AS rn
      FROM AllSwipes
    )
    SELECT
      LocaleMessageTime,
      CONVERT(VARCHAR(10), LocaleMessageTime, 23) AS Dateonly,
      CONVERT(VARCHAR(8), LocaleMessageTime, 108) AS Swipe_Time,
      EmployeeID,
      PersonGUID,
      ObjectName1,
      Door,
      PersonnelType,
      CardNumber,
      Text5,
      PartitionName2,
      AdmitCode,
      Direction,
      CompanyName,
      PrimaryLocation
    FROM LastPerPerson
    WHERE rn = 1
    ORDER BY LocaleMessageTime ASC;
  `;

  const req = pool.request();
  // Bind as NVARCHAR so node/mssql doesn't convert the string to a JS Date
  req.input('dt', sql.NVarChar(50), datetimeISO);

  if (location) req.input('location', sql.NVarChar, location);

  const result = await req.query(query);
  return result.recordset;
};