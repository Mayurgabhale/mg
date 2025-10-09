const query = `
  WITH Hist AS (
    ${unionQueries}
  ),
  Ranked AS (
    SELECT *,
           ROW_NUMBER() OVER (
             PARTITION BY CONVERT(date, LocaleMessageTime), PersonGUID
             ORDER BY LocaleMessageTime ASC
           ) AS rn
    FROM Hist
  )
  SELECT *
  FROM Ranked
  WHERE rn = 1
  ${filterClause}
  ORDER BY LocaleMessageTime ASC;
`;