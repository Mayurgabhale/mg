const query = `
WITH AllSwipes AS (
  SELECT
    t1.PersonGUID,
    t1.PersonnelType,
    t1.EmployeeID,
    t1.CompanyName,
    t1.PartitionName2,
    t1.Text5 AS PrimaryLocation,
    t1.CardNumber,
    t1.ObjectName1,
    t1.Door,
    t1.AdmitCode,
    t1.Direction,
    DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
    CAST(DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS DATE) AS Dateonly,
    FORMAT(DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC), 'HH:mm:ss') AS Swipe_Time,
    t1.Floor
  FROM EMEA_CardEvent t1
  WHERE
    t1.MessageType = 'CardAdmitted'
    ${location ? "AND t1.PartitionName2 = @location" : ""}
    AND CONVERT(date, DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC))
        = CONVERT(date, TRY_CAST(@dt AS DATETIME2)) -- ✅ only same date
    AND DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC)
        <= TRY_CAST(@dt AS DATETIME2)                -- ✅ up to that exact time
),

LastPerPerson AS (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY PersonGUID ORDER BY LocaleMessageTime DESC) AS rn
  FROM AllSwipes
)
SELECT
  t.PersonGUID,
  t.EmployeeID,
  t.PersonnelType,
  t.CompanyName,
  t.PartitionName2,
  t.PrimaryLocation,
  t.CardNumber,
  t.ObjectName1,
  t.Door,
  t.AdmitCode,
  t.Direction,
  t.LocaleMessageTime,
  t.Dateonly,
  t.Swipe_Time,
  t.Floor
FROM LastPerPerson t
WHERE rn = 1 AND t.Direction = 'InDirection';
`;






