exports.fetchOccupancyAtTime = async (location, untilUtc) => {
  const pool = await poolPromise;
  const query = `
    SELECT
      t1.MessageUTC,
      t1.ObjectName1,
      t1.ObjectName2 AS Door,
      t1.PartitionName2,
      t1.ObjectIdentity1 AS PersonGUID,
      t3.Name AS PersonnelType,
      t5d.value AS Direction
    FROM [ACVSUJournal_00011029].[dbo].[ACVSUJournalLog] AS t1
    LEFT JOIN [ACVSCore].[Access].[Personnel] AS t2 ON t1.ObjectIdentity1 = t2.GUID
    LEFT JOIN [ACVSCore].[Access].[PersonnelType] AS t3 ON t2.PersonnelTypeId = t3.ObjectID
    LEFT JOIN [ACVSUJournal_00011029].[dbo].[ACVSUJournalLogxmlShred] AS t5d
      ON t1.XmlGUID = t5d.GUID AND t5d.Value IN ('InDirection','OutDirection')
    WHERE
      t1.MessageType = 'CardAdmitted'
      AND t1.PartitionName2 = @location
      AND t1.MessageUTC <= @until
      AND DATEADD(HOUR, -24, @until) < t1.MessageUTC
    ORDER BY t1.MessageUTC ASC;
  `;
  const req = pool.request();
  req.input('location', sql.NVarChar, location);
  req.input('until', sql.DateTime2, untilUtc);
  const result = await req.query(query);
  return result.recordset;
};