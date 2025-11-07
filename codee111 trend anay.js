not wokr getting empty
[
    {
        "controllername": "IN-PUN-2NDFLR-ISTAR PRO",
        "IP_address": "10.199.13.10",
        "Location": "APAC",
        "City": "Pune 2nd Floor",
        "Doors": []
    },
    {
        "controllername": "IN-PUN-PODIUM-ISTAR PRO-01",
        "IP_address": "10.199.8.20",
        "Location": "APAC",
        "City": "Pune Podium",
        "Doors": []
    },
    {
        "controllername": "IN-PUN-PODIUM-ISTAR PRO-02",
        "IP_address": "10.199.8.21",
        "Location": "APAC",
        "City": "Pune Podium",
        "Doors": []
    },
    {

      

const XLSX = require("xlsx");
const fs = require("fs");

// File paths
const controllerDataPath = "C:\\Users\\W0024618\\Desktop\\Backend\\src\\data\\ControllerData.xlsx";
const controllerWithDoorPath = "C:\\Users\\W0024618\\Desktop\\Backend\\src\\data\\controllerWithdoor.xlsx";
const outputJsonPath = "C:\\Users\\W0024618\\Desktop\\Backend\\src\\data\\ControllerDataWithDoorReader.json";

// Helper to read Excel as JSON
function readExcel(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.SheetNames[0];
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { defval: "" });
}

// Load both files
const controllerData = readExcel(controllerDataPath);
const doorDataRaw = readExcel(controllerWithDoorPath);

// --- Step 1: Forward-fill controllername & IP address ---
// Some controllers appear AFTER their door rows in Excel.
// We'll process from top to bottom, tracking last known controller & IP.
let lastController = "";
let lastIP = "";

const doorData = doorDataRaw.map((row) => {
  // If row has a controller name/IP, update tracking vars
  if (row.controllername && row.controllername.trim()) {
    lastController = row.controllername.trim();
  }
  if (row.IP_address && row.IP_address.toString().trim()) {
    lastIP = row.IP_address.toString().trim();
  }

  // Fill missing values with last known
  return {
    controllername: lastController,
    IP_address: lastIP,
    Door: row.Door ? row.Door.trim() : "",
    reader: row.reader ? row.reader.trim() : ""
  };
});

// --- Step 2: Merge controller data with door data ---
const result = controllerData.map((ctrl) => {
  const doorsForCtrl = doorData.filter(
    (d) =>
      d.controllername === ctrl.controllername &&
      d.IP_address === ctrl.IP_address
  );

  // Build door objects
  const doorsList = doorsForCtrl.map((d) => ({
    Door: d.Door,
    Reader: d.reader
  }));

  return {
    controllername: ctrl.controllername,
    IP_address: ctrl.IP_address,
    Location: ctrl.Location,
    City: ctrl.City,
    Doors: doorsList
  };
});

// --- Step 3: Write output JSON ---
fs.writeFileSync(outputJsonPath, JSON.stringify(result, null, 4), "utf8");
console.log("✅ ControllerDataWithDoorReader.json created successfully:");
console.log(outputJsonPath);
