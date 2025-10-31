AND CONVERT(DATE, DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC))
    = CONVERT(DATE, DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, GETUTCDATE()))




        

.........

AND DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC)
    >= DATEADD(DAY, DATEDIFF(DAY, 0, DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, GETUTCDATE())), 0)
AND DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC)
    <  DATEADD(DAY, DATEDIFF(DAY, 0, DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, GETUTCDATE())) + 1, 0)
