PS C:\Users\W0024618\Desktop\Backend> node checkSheets.js
Sheets found in Excel:
[ 'RAW Data Door', 'NEW' ]
PS C:\Users\W0024618\Desktop



function readExcel(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets["NEW"]; // 👈 specify correct sheet name
  return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}
