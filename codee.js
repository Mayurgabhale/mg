const dayLogs = safeJsonParse(f);





let todayLogs = fs.existsSync(todayLogFile)
  ? safeJsonParse(todayLogFile)
  : {};