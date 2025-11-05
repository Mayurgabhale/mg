read this code carefully, with this code we will create emea ok 
so only read this code. dont answer me 
// GET /api/occupancy-at-time-pune?date=YYYY-MM-DD&time=HH:MM[:SS]
exports.getPuneSnapshotAtDateTime = async (req, res) => {
  try {
    const { date, time } = req.query;
    if (!date || !time) {
      return res.status(400).json({
        error: 'missing query params: expected ?date=YYYY-MM-DD&time=HH:MM[:SS]'
      });
    }

    // Validate date
    const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    if (!dateMatch) {
      return res.status(400).json({ error: 'invalid "date" format; expected YYYY-MM-DD' });
    }

    // Validate time
    const timeMatch = /^([0-1]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(time);
    if (!timeMatch) {
      return res.status(400).json({ error: 'invalid "time" format; expected HH:MM or HH:MM:SS' });
    }

    const year   = Number(dateMatch[1]);
    const month  = Number(dateMatch[2]);
    const day    = Number(dateMatch[3]);
    const hour   = Number(timeMatch[1]);
    const minute = Number(timeMatch[2]);
    const second = timeMatch[3] ? Number(timeMatch[3]) : 0;

    // Build Pune-local datetime
    const atDt = DateTime.fromObject(
      { year, month, day, hour, minute, second, millisecond: 0 },
      { zone: 'Asia/Kolkata' }
    );

    if (!atDt.isValid) {
      return res.status(400).json({ error: 'invalid date+time combination' });
    }

    // Convert to UTC for SQL boundary
    const untilUtc = atDt.setZone('utc').toJSDate();

    // -----------------
    // Step 1: fetch events in 24h window ending at atDt
    const pool = await getPool();
    const reqDb = pool.request();
    reqDb.input('until', sql.DateTime2, untilUtc);

    const { recordset } = await reqDb.query(`
      WITH CombinedQuery AS (
        SELECT
          t1.MessageUTC,   -- always UTC
          t1.ObjectName1,
          CASE
            WHEN t3.Name IN ('Contractor','Terminated Contractor') THEN t2.Text12
            ELSE CAST(t2.Int1 AS NVARCHAR)
          END AS EmployeeID,
          t1.ObjectIdentity1 AS PersonGUID,
          t3.Name AS PersonnelType,
          COALESCE(
            TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID/Card)[1]','varchar(50)'),
            TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID)[1]','varchar(50)'),
            sc.value
          ) AS CardNumber,
          t5a.value AS AdmitCode,
          t5d.value AS Direction,
          t1.ObjectName2 AS Door,
           t2.Text4 AS CompanyName,          -- ✅ added
           t2.Text5 AS PrimaryLocation       -- ✅ added
        FROM [ACVSUJournal_00010030].[dbo].[ACVSUJournalLog] t1
        LEFT JOIN [ACVSCore].[Access].[Personnel]     t2 ON t1.ObjectIdentity1 = t2.GUID
        LEFT JOIN [ACVSCore].[Access].[PersonnelType] t3 ON t2.PersonnelTypeId = t3.ObjectID
        LEFT JOIN [ACVSUJournal_00010030].[dbo].[ACVSUJournalLogxmlShred] t5a
          ON t1.XmlGUID = t5a.GUID AND t5a.Name = 'AdmitCode'
        LEFT JOIN [ACVSUJournal_00010030].[dbo].[ACVSUJournalLogxmlShred] t5d
          ON t1.XmlGUID = t5d.GUID AND t5d.Value IN ('InDirection','OutDirection')
        LEFT JOIN [ACVSUJournal_00010030].[dbo].[ACVSUJournalLogxml] t_xml
          ON t1.XmlGUID = t_xml.GUID
        LEFT JOIN (
          SELECT GUID, value
          FROM [ACVSUJournal_00010030].[dbo].[ACVSUJournalLogxmlShred]
          WHERE Name IN ('Card','CHUID')
        ) sc ON t1.XmlGUID = sc.GUID
        WHERE
          t1.MessageType     = 'CardAdmitted'
          AND t1.PartitionName2 = 'APAC.Default'
          AND t1.MessageUTC <= @until
          AND DATEADD(HOUR, -24, @until) < t1.MessageUTC
      )
      SELECT *
      FROM CombinedQuery
      ORDER BY MessageUTC ASC;
    `);

    // -----------------
    // Step 2: convert UTC → Asia/Kolkata
    const events = recordset.map(e => {
      const local = DateTime.fromJSDate(e.MessageUTC, { zone: 'utc' })
                            .setZone('Asia/Kolkata');
      return {
        ...e,
        LocaleMessageTime: local.toISO(),
        Dateonly: local.toFormat('yyyy-LL-dd'),
        Swipe_Time: local.toFormat('HH:mm:ss'),
      };
    });

    // -----------------
    // Step 3: filter only same Pune date
    const targetDate = atDt.toFormat('yyyy-LL-dd');
    const filtered = events.filter(e => e.Dateonly === targetDate);

    // Step 4: build occupancy snapshot
    const occupancy = await buildOccupancy(filtered);

    // Step 5: visited-today counts aligned to atDt
    // const visitedStats = buildVisitedToday(filtered);
    
    const visitedStats = buildVisitedToday(filtered, atDt);  // this add new code as per function buildVisitedToday change 📝 📝

    // ---- Output timestamps ----
    occupancy.asOfLocal = atDt.toISO(); // Pune-local with offset
    occupancy.asOfUTC   = `${date}T${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}:${String(second).padStart(2,'0')}Z`;

    occupancy.totalVisitedToday = visitedStats.total;
    occupancy.visitedToday = visitedStats;

    return res.json(occupancy);
  } catch (err) {
    console.error('getPuneSnapshotAtDateTime error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
