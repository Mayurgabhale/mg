let todayLogs = fs.existsSync(todayLogFile)
  ? safeJsonParse(todayLogFile)
  : {};