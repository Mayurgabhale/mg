// npm install xlsx
const XLSX = require("xlsx");
const fs = require("fs");

// Input and output file paths
const inputPath = "C:\\Users\\W0024618\\Desktop\\Backend\\src\\data\\controllerWithdoor.xlsx";
const outputPath = "C:\\Users\\W0024618\\Desktop\\Backend\\src\\data\\controllerWithdoor.json";

// --- Step 1: Read Excel ---
function readExcel(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.SheetNames[0];
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { defval: "" });
}

const rawData = readExcel(inputPath);

// --- Step 2: Forward-fill controllername & IP ---
let lastController = "";
let lastIP = "";

const filledData = rawData.map((row) => {
  if (row.controllername && row.controllername.trim()) {
    lastController = row.controllername.trim();
  }
  if (row.IP_address && row.IP_address.toString().trim()) {
    lastIP = row.IP_address.toString().trim();
  }
  return {
    controllername: lastController,
    IP_address: lastIP,
    Door: (row.Door || "").trim(),
    reader: (row.reader || "").trim()
  };
});

// --- Step 3: Group by controller ---
const grouped = {};

filledData.forEach((row) => {
  if (!row.controllername || !row.IP_address) return; // skip blanks
  if (!grouped[row.controllername]) {
    grouped[row.controllername] = {
      controllername: row.controllername,
      IP_address: row.IP_address,
      Doors: []
    };
  }
  if (row.Door || row.reader) {
    grouped[row.controllername].Doors.push({
      Door: row.Door,
      Reader: row.reader
    });
  }
});

// --- Step 4: Convert to array ---
const result = Object.values(grouped);

// --- Step 5: Write JSON file ---
fs.writeFileSync(outputPath, JSON.stringify(result, null, 4), "utf8");
console.log("✅ Converted successfully to JSON:");
console.log(outputPath);