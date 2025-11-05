/**
 * TimeTravel occupancy: snapshot of "last swipe per person <= selected datetime"
 * - datetimeISO: string (ex: '2025-11-05T10:40:00' or with timezone '2025-11-05T10:40:00+01:00')
 * - location: optional partition name (ex: 'UK.London')
 */
exports.fetchTimeTravelOccupancy = async (datetimeISO, location = null) => {
  const pool = await poolPromise;
  const partitionsSql = partitionList.map(p => `'${p.replace("'", "''")}'`).join(',');

  const locationFilter = location
    ? `AND t1.PartitionName2 = @location`
    : `AND t1.PartitionName2 IN (${partitionsSql})`;

  // We compute LocaleMessageTime same as other queries then pick last swipe per PersonGUID <= @dt
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
        t2.Text4                   AS CompanyName,
        t2.Text5                   AS PrimaryLocation,
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
        AND DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) <= @dt
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
  req.input('dt', sql.DateTime2, new Date(datetimeISO)); // server-side parse; will throw if invalid
  if (location) req.input('location', sql.NVarChar, location);
  const result = await req.query(query);
  return result.recordset;
};










......

..
exports.getTimeTravelOccupancy = async (req, res) => {
  try {
    const datetime = req.query.datetime;
    const location = req.query.location || null;

    if (!datetime) {
      return res.status(400).json({ success: false, message: 'query param "datetime" required (ISO format)' });
    }

    // validate date
    const dt = new Date(datetime);
    if (Number.isNaN(dt.getTime())) {
      return res.status(400).json({ success: false, message: 'invalid datetime. Use ISO format e.g. 2025-11-05T10:40:00' });
    }

    // fetch the snapshot (last swipe per person <= dt)
    const swipes = await service.fetchTimeTravelOccupancy(datetime, location);

    // Build same shape as realtime: lastByPerson equivalent is already enforced by SQL
    const summary = { total: 0, Employee: 0, Contractor: 0 };
    const partitions = {};
    const unmappedDoors = new Set();

    // For per-floor breakdown, reuse lookupFloor
    swipes.forEach(r => {
      // Map floor (this also collects unmapped doors)
      const rawFloor = lookupFloor(r.PartitionName2, r.Door, r.Direction, unmappedDoors);
      const floorNorm = rawFloor ? String(rawFloor).trim().toLowerCase() : '';

      // Skip "Out of office" as in your realtime logic
      if (floorNorm === 'out of office') {
        return;
      }

      // Count region-level (or single location if provided)
      summary.total++;
      if (isEmployeeType(r.PersonnelType)) summary.Employee++;
      else summary.Contractor++;

      // Partition-level counts only if caller requested whole EMEA (no specific location)
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

    // Build details array (enriched with Floor), excluding 'Out of office'
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

    return res.json({
      success: true,
      datetime: dt.toISOString(),
      summary,
      partitions: location ? undefined : partitions,
      details
    });
  } catch (err) {
    console.error('TimeTravel error', err);
    return res.status(500).json({ success: false, message: 'TimeTravel occupancy failed' });
  }
};