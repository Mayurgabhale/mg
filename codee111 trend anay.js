// npm install xlsx
const XLSX = require("xlsx");
const fs = require("fs");

// Paths
const controllerDataPath = "C:\\Users\\W0024618\\Desktop\\Backend\\src\\data\\ControllerData.xlsx";
const controllerWithDoorPath = "C:\\Users\\W0024618\\Desktop\\Backend\\src\\data\\controllerWithdoor.xlsx";
const outputJsonPath = "C:\\Users\\W0024618\\Desktop\\Backend\\src\\data\\ControllerDataWithDoorReader.json";

/**
 * Read a specific sheet or auto-detect the right one
 */
function readExcel(filePath) {
  const workbook = XLSX.readFile(filePath);

  // ✅ Use "NEW" sheet if it exists (this is where your data is)
  const sheetName = workbook.SheetNames.includes("NEW")
    ? "NEW"
    : workbook.SheetNames[0];

  console.log("📄 Reading sheet:", sheetName);

  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });
}

/**
 * Normalize Excel headers to consistent field names
 */
function normalizeRowKeys(row) {
  const normalized = {};
  for (const k in row) {
    const key = k.toString().trim().toLowerCase().replace(/\s+/g, "_");
    const val = row[k];
    if (/controller|controllername/.test(key)) normalized.controllername = val;
    else if (/ip|ip_address|ipaddress/.test(key)) normalized.IP_address = val;
    else if (/door/.test(key) && !/reader/.test(key)) normalized.Door = val;
    else if (/reader/.test(key)) normalized.reader = val;
    else if (/location/.test(key)) normalized.Location = val;
    else if (/city/.test(key)) normalized.City = val;
  }
  return normalized;
}

try {
  // --- Step 1: Load controller data ---
  const controllerRaw = readExcel(controllerDataPath);
  const controllerData = controllerRaw.map(normalizeRowKeys);

  // --- Step 2: Load door mapping data (from "NEW" sheet) ---
  const doorRaw = readExcel(controllerWithDoorPath);
  const doorNorm = doorRaw.map(normalizeRowKeys);

  const sanitize = (v) => (v === null || v === undefined ? "" : String(v).trim());

  const doorRows = doorNorm.map((r) => ({
    controllername: sanitize(r.controllername),
    IP_address: sanitize(r.IP_address),
    Door: sanitize(r.Door),
    reader: sanitize(r.reader),
  }));

  // --- Step 3: Forward & backward fill ---
  let lastController = "", lastIP = "";
  for (let i = 0; i < doorRows.length; i++) {
    if (doorRows[i].controllername) lastController = doorRows[i].controllername;
    if (doorRows[i].IP_address) lastIP = doorRows[i].IP_address;
    if (!doorRows[i].controllername) doorRows[i].controllername = lastController;
    if (!doorRows[i].IP_address) doorRows[i].IP_address = lastIP;
  }

  let nextController = "", nextIP = "";
  for (let i = doorRows.length - 1; i >= 0; i--) {
    if (doorRows[i].controllername) nextController = doorRows[i].controllername;
    if (doorRows[i].IP_address) nextIP = doorRows[i].IP_address;
    if (!doorRows[i].controllername) doorRows[i].controllername = nextController;
    if (!doorRows[i].IP_address) doorRows[i].IP_address = nextIP;
  }

  // --- Step 4: Filter clean rows ---
  const doorRowsFiltered = doorRows.filter(
    (r) => r.controllername && r.IP_address && (r.Door || r.reader)
  );

  // --- Step 5: Merge ---
  const result = controllerData.map((ctrl) => {
    const ctrlName = sanitize(ctrl.controllername);
    const ctrlIP = sanitize(ctrl.IP_address);

    const doorsForCtrl = doorRowsFiltered.filter(
      (d) => d.controllername === ctrlName && d.IP_address === ctrlIP
    );

    const doorsList = doorsForCtrl.map((d) => ({
      Door: d.Door,
      Reader: d.reader,
    }));

    return {
      controllername: ctrlName,
      IP_address: ctrlIP,
      Location: sanitize(ctrl.Location),
      City: sanitize(ctrl.City),
      Doors: doorsList,
    };
  });

  // --- Step 6: Save JSON ---
  fs.writeFileSync(outputJsonPath, JSON.stringify(result, null, 4), "utf8");

  console.log("✅ JSON written to:", outputJsonPath);
  console.log("✅ Total controllers:", result.length);
} catch (err) {
  console.error("❌ Error:", err.message);
}