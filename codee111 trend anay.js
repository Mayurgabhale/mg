// Required packages
// Run this first if not installed:
// npm install xlsx fs path

const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// File paths
const controllerDataPath = "C:\\Users\\W0024618\\Desktop\\Backend\\src\\data\\ControllerData.xlsx";
const controllerWithDoorPath = "C:\\Users\\W0024618\\Desktop\\Backend\\src\\data\\controllerWithdoor.xlsx";
const outputJsonPath = "C:\\Users\\W0024618\\Desktop\\Backend\\src\\data\\ControllerDataWithDoorReader.json";

// Helper function to read Excel file
function readExcel(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
}

// Read both Excel files
const controllerData = readExcel(controllerDataPath);
const doorDataRaw = readExcel(controllerWithDoorPath);

// Forward fill controllername and IP_address in doorData
let lastController = "";
let lastIP = "";
const doorData = doorDataRaw.map(row => {
  if (row.controllername) lastController = row.controllername;
  if (row.IP_address) lastIP = row.IP_address;
  return {
    controllername: lastController,
    IP_address: lastIP,
    Door: row.Door || "",
    reader: row.reader || ""
  };
});

// Merge controller data and door mapping
const result = [];

controllerData.forEach(ctrl => {
  const matchingDoors = doorData.filter(
    d => d.controllername === ctrl.controllername && d.IP_address === ctrl.IP_address
  );

  const doorsList = matchingDoors.map(d => ({
    Door: d.Door.trim(),
    Reader: d.reader ? d.reader.trim() : ""
  }));

  result.push({
    controllername: ctrl.controllername,
    IP_address: ctrl.IP_address,
    Location: ctrl.Location,
    City: ctrl.City,
    Doors: doorsList
  });
});

// Write to JSON file
fs.writeFileSync(outputJsonPath, JSON.stringify(result, null, 4), "utf8");

console.log("✅ JSON file created successfully at:");
console.log(outputJsonPath);