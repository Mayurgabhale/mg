const XLSX = require("xlsx");
const file = "C:\\Users\\W0024618\\Desktop\\Backend\\src\\data\\controllerWithdoor.xlsx";

const workbook = XLSX.readFile(file);
console.log("Sheets found in Excel:");
console.log(workbook.SheetNames);



node checkSheets.js