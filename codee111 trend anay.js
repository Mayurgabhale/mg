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

console.log("✅ Total rows read:", rawData.length);
console.log("✅ Sample keys:", Object.keys(rawData[0]));

// --- Step 2: Fix and normalize keys ---
function normalizeKey(key) {
  return key.trim().toLowerCase().replace(/\s+/g, "_");
}

// Normalize rows (so even if headers are weird, we still get them)
const normalizedData = rawData.map((row) => {
  const obj = {};
  for (const key in row) {
    obj[normalizeKey(key)] = row[key];
  }
  return obj;
});

// --- Step 3: Forward-fill controllername & IP ---
let lastController = "";
let lastIP = "";

const filledData = normalizedData.map((row) => {
  if (row.controllername && row.controllername.trim()) {
    lastController = row.controllername.trim();
  }
  if (row.ip_address && row.ip_address.toString().trim()) {
    lastIP = row.ip_address.toString().trim();
  }
  return {
    controllername: lastController,
    ip_address: lastIP,
    door: (row.door || "").trim(),
    reader: (row.reader || "").trim(),
  };
});

// --- Step 4: Group by controller ---
const grouped = {};

filledData.forEach((row) => {
  if (!row.controllername || !row.ip_address) return;

  if (!grouped[row.controllername]) {
    grouped[row.controllername] = {
      controllername: row.controllername,
      ip_address: row.ip_address,
      doors: [],
    };
  }

  if (row.door || row.reader) {
    grouped[row.controllername].doors.push({
      Door: row.door,
      Reader: row.reader,
    });
  }
});

// --- Step 5: Convert and save ---
const result = Object.values(grouped);
fs.writeFileSync(outputPath, JSON.stringify(result, null, 4), "utf8");

console.log("✅ JSON created successfully:", outputPath);
console.log("Total controllers:", result.length);