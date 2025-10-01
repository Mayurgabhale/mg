
    WITH CombinedEmployeeData AS (
      SELECT
        t1.ObjectName1,
        t1.ObjectName2             AS Door,               -- include Door
        CASE WHEN t2.Int1 = 0 THEN t2.Text12 ELSE CAST(t2.Int1 AS NVARCHAR) END AS EmployeeID,
        t3.Name                    AS PersonnelType,
        t1.ObjectIdentity1         AS PersonGUID,
        -- extract CardNumber from XML or shred table
        COALESCE(
          TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID/Card)[1]','varchar(50)'),
          TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID)[1]','varchar(50)'),
          sc.value
        )                          AS CardNumber,
        CASE
          WHEN t1.ObjectName2 LIKE 'APAC_PI%' THEN 'Taguig City'
          WHEN t1.ObjectName2 LIKE 'APAC_PH%' THEN 'Quezon City'
          WHEN t1.ObjectName2 LIKE '%PUN%'   THEN 'Pune'
          WHEN t1.ObjectName2 LIKE 'APAC_JPN%' THEN 'JP.Tokyo'
          WHEN t1.ObjectName2 LIKE 'APAC_MY%'  THEN 'MY.Kuala Lumpur'
          WHEN t1.ObjectName2 LIKE 'IN.HYD%'  THEN 'IN.HYD'
          ELSE t1.PartitionName2
        END                        AS PartitionName2,
        DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
        t5d.value                  AS Direction,
        t2.Text4                   AS CompanyName,        -- ✅ added
        t2.Text5                   AS PrimaryLocation     -- ✅ added
      FROM ACVSUJournal_00010029.dbo.ACVSUJournalLog t1
      JOIN ACVSCore.Access.Personnel       t2 ON t1.ObjectIdentity1 = t2.GUID
      JOIN ACVSCore.Access.PersonnelType   t3 ON t2.PersonnelTypeID = t3.ObjectID

      LEFT JOIN ACVSUJournal_00010029.dbo.ACVSUJournalLogxmlShred t5d
      ON t1.XmlGUID = t5d.GUID AND t5d.Value IN ('InDirection','OutDirection')

      LEFT JOIN ACVSUJournal_00010029.dbo.ACVSUJournalLogxml t_xml
        ON t1.XmlGUID = t_xml.GUID
      LEFT JOIN (
        SELECT GUID, value
        FROM ACVSUJournal_00010029.dbo.ACVSUJournalLogxmlShred
        WHERE Name IN ('Card','CHUID')
      ) AS sc
        ON t1.XmlGUID = sc.GUID
      WHERE
        t1.MessageType = 'CardAdmitted'
        AND t1.PartitionName2 IN (${parts})
        AND CONVERT(DATE, DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC))
            = CONVERT(DATE, GETDATE())
    ), Ranked AS (
      SELECT *,
        ROW_NUMBER() OVER (PARTITION BY PersonGUID ORDER BY LocaleMessageTime DESC) AS rn
      FROM CombinedEmployeeData
      
    )
    SELECT
      ObjectName1,
      Door,                            -- door
      PersonnelType,
      EmployeeID,
      CardNumber,                      -- now returned
      PartitionName2,
      LocaleMessageTime,
      Direction,
      PersonGUID,
      CompanyName,                      -- ✅ added
      PrimaryLocation                   -- ✅ added
    FROM Ranked
    WHERE rn = 1;
  `;

++++++++++++++++ In below queiry i want ot add 
 CompanyName,                      -- ✅ added
      PrimaryLocation                   -- ✅ added
      so whow to add 
  
  const { recordset } = await req.query(`
    WITH CombinedQuery AS (
      SELECT
        DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
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
        t1.ObjectName2 AS Door
      FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLog] t1
      LEFT JOIN [ACVSCore].[Access].[Personnel] t2 ON t1.ObjectIdentity1 = t2.GUID
      LEFT JOIN [ACVSCore].[Access].[PersonnelType] t3 ON t2.PersonnelTypeId = t3.ObjectID
      LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred] t5a
        ON t1.XmlGUID = t5a.GUID AND t5a.Name = 'AdmitCode'
      LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred] t5d
        ON t1.XmlGUID = t5d.GUID AND t5d.Value IN ('InDirection','OutDirection')
      LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxml] t_xml
        ON t1.XmlGUID = t_xml.GUID
      LEFT JOIN (
        SELECT GUID, value
        FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred]
        WHERE Name IN ('Card','CHUID')
      ) sc ON t1.XmlGUID = sc.GUID
      WHERE
        t1.MessageType = 'CardAdmitted'
        AND t1.PartitionName2 = 'APAC.Default'
        AND DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) > @since
    )
    SELECT
      LocaleMessageTime,
      CONVERT(VARCHAR(10), LocaleMessageTime, 23) AS Dateonly,
      CONVERT(VARCHAR(8), LocaleMessageTime, 108) AS Swipe_Time,
      EmployeeID,
      PersonGUID,
      ObjectName1,
      PersonnelType,
      CardNumber,
      AdmitCode,
      Direction,
      Door
    FROM CombinedQuery
    ORDER BY LocaleMessageTime ASC;
  `);


