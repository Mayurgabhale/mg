not work
i got "datetime": "2025-11-04T18:20:00.000Z", this time occupancy 
http://localhost:3005/api/occupancy/time-travel?datetime=2025-11-04T23:50:00
{
  "success": true,
  "datetime": "2025-11-04T18:20:00.000Z",
  "summary": {
    "total": 399,
    "Employee": 361,
    "Contractor": 38
  },
  "partitions": {
    "AUT.Vienna": {
      "total": 83,
      "Employee": 73,
      "Contractor": 10,
      "floors": {
        "11th Floor": 83
      }
    },
    "LT.Vilnius": {
      "total": 177,
      "Employee": 159,
      "Contractor": 18,
      "floors": {
        "2nd Floor": 8,
        "9th Floor": 20,
        "1st Floor": 51,
        "8th Floor": 15,
        "10st Floor": 1,
        "4th Floor": 19,
        "5th Floor": 17,
        "10th Floor": 16,
        "6th Floor": 11,
        "7th Floor": 15,
        "3rd Floor": 3,
        "Basement": 1
      }
    },
    "ES.Madrid": {
      "total": 31,
      "Employee": 31,
      "Contractor": 0,
      "floors": {
        "Madrid": 31
      }
    },
    "RU.Moscow": {
      "total": 18,
      "Employee": 15,
      "Contractor": 3,
      "floors": {
        "Moscow": 18
      }
    },
    "IT.Rome": {
      "total": 17,
      "Employee": 16,
      "Contractor": 1,
      "floors": {
        "Rome": 17
      }
    },
    "IE.Dublin": {
      "total": 17,
      "Employee": 13,
      "Contractor": 4,
      "floors": {
        "Dublin": 17
      }
    },
    "MA.Casablanca": {
      "total": 35,
      "Employee": 34,
      "Contractor": 1,
      "floors": {
        "7th Floor": 35
      }
    },
    "UK.London": {
      "total": 5,
      "Employee": 4,
      "Contractor": 1,
      "floors": {
        "London": 5
      }
    },
    "DU.Abu Dhab": {
      "total": 16,
      "Employee": 16,
      "Contractor": 0,
      "floors": {
        "Dubai": 16
      }
    }
  },
  "details": [
    {
      "LocaleMessageTime": "2025-10-20T13:41:36.000Z",
      "Dateonly": "2025-10-20",
      "Swipe_Time": "13:41:36",
      "EmployeeID": "322513",
      "PersonGUID": "BFEFCB61-3F1B-4B0A-99A6-9091C8EBCF59",
      "ObjectName1": "Vural, Turkan",
      "Door": "EMEA_AUT_VIENNA_ICON_11FLR_RECEPTION Door",
      "PersonnelType": "Employee",
      "CardNumber": "608903",
      "Text5": "Vienna-Gertrude",
      "PartitionName2": "AUT.Vienna",
      "AdmitCode": "Admit",
      "Direction": "InDirection",
      "CompanyName": "WUPSIL Office Austria",
      "PrimaryLocation": "Vienna-Gertrude",
      "Floor": "11th Floor"
    },
    {
      "LocaleMessageTime": "2025-10-20T14:26:13.000Z",
      "Dateonly": "2025-10-20",
      "Swipe_Time": "14:26:13",
      "EmployeeID": null,
      "PersonGUID": "FE7B5E77-9A08-4B6A-A7A1-5EFFE98C7CB8",
      "ObjectName1": "Temp Card No4, Casablanca",
      "Door": "EMEA_LTU_VNO_GAMA_2nd floor_West Door",
      "PersonnelType": null,
      "CardNumber": "619337",
      "Text5": null,
      "PartitionName2": "LT.Vilnius",
      "AdmitCode": "Admit",
      "Direction": "InDirection",
      "CompanyName": null,
      "PrimaryLocation": null,
      "Floor": "2nd Floor"
    },
    {
      "LocaleMessageTime": "2025-10-20T15:00:49

      read thsi below code and correct it carefully  


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

  // const req = pool.request();

  // req.input('dt', sql.DateTime2, new Date(datetimeISO)); // server-side parse; will throw if invalid

  // if (location) req.input('location', sql.NVarChar, location);
  // const result = await req.query(query);
  // return result.recordset;


  const req = pool.request();

// 🚫 old — converts to UTC
// req.input('dt', sql.DateTime2, new Date(datetimeISO));

// ✅ new — keeps exact time as given
req.input('dt', sql.DateTime2, datetimeISO);

if (location) req.input('location', sql.NVarChar, location);

const result = await req.query(query);
return result.recordset;
};






module.exports.partitionList = partitionList;




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



