
function safeJsonParse(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8").trim();
    if (!content) return {};  // empty file = empty object
    return JSON.parse(content);
  } catch (err) {
    console.error("❌ Corrupted JSON file detected:", filePath);
    console.error("Error:", err.message);
    return {};  // fallback so server NEVER crashes
  }
}





const dayLogs = safeJsonParse(f);





let todayLogs = fs.existsSync(todayLogFile)
  ? safeJsonParse(todayLogFile)
  : {};