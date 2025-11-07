// npm install xlsx
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// Paths (keep as you provided)
const controllerDataPath = "C:\\Users\\W0024618\\Desktop\\Backend\\src\\data\\ControllerData.xlsx";
const controllerWithDoorPath = "C:\\Users\\W0024618\\Desktop\\Backend\\src\\data\\controllerWithdoor.xlsx";
const outputJsonPath = "C:\\Users\\W0024618\\Desktop\\Backend\\src\\data\\ControllerDataWithDoorReader.json";

/**
 * Read first sheet and return array of rows (object). defval:"" makes empty cells = ""
 */
function readExcel(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });
}

/**
 * Normalize keys of a row object:
 * Map likely header variants to standard keys:
 *   controllername, IP_address, Door, reader, Location, City
 */
function normalizeRowKeys(row) {
  const normalized = {};
  Object.keys(row).forEach((k) => {
    const key = k.toString().trim().toLowerCase().replace(/\s+/g, "_");
    const val = row[k];
    if (/controller|controllername/.test(key)) normalized.controllername = val;
    else if (/ip|ip_address|ipaddress/.test(key)) normalized.IP_address = val;
    else if (/door/.test(key) && !/reader/.test(key)) normalized.Door = val;
    else if (/reader/.test(key)) normalized.reader = val;
    else if (/location/.test(key)) normalized.Location = val;
    else if (/city/.test(key)) normalized.City = val;
    else {
      // keep any unexpected columns as-is (optional)
      normalized[k] = val;
    }
  });
  return normalized;
}

try {
  // 1) Load controller master sheet (no blanks expected)
  const controllerRaw = readExcel(controllerDataPath);
  const controllerData = controllerRaw.map(normalizeRowKeys);

  // 2) Load door mapping sheet (may have many blanks)
  const doorRaw = readExcel(controllerWithDoorPath);
  const doorNorm = doorRaw.map(normalizeRowKeys);

  // 3) Convert all string values to trimmed string (and keep blank as "")
  const sanitize = (v) => (v === null || v === undefined ? "" : String(v).trim());

  // Apply sanitize to each normalized row
  const doorRows = doorNorm.map((r) => ({
    controllername: sanitize(r.controllername),
    IP_address: sanitize(r.IP_address),
    Door: sanitize(r.Door),
    reader: sanitize(r.reader)
  }));

  // 4) Forward-fill (top -> bottom)
  let lastController = "";
  let lastIP = "";
  for (let i = 0; i < doorRows.length; i++) {
    if (doorRows[i].controllername) lastController = doorRows[i].controllername;
    if (doorRows[i].IP_address) lastIP = doorRows[i].IP_address;
    // if blank, fill with last known (may remain "" if none known)
    if (!doorRows[i].controllername && lastController) doorRows[i].controllername = lastController;
    if (!doorRows[i].IP_address && lastIP) doorRows[i].IP_address = lastIP;
  }

  // 5) Backward-fill (bottom -> top) to handle groups where controller appears below its doors
  let nextController = "";
  let nextIP = "";
  for (let i = doorRows.length - 1; i >= 0; i--) {
    if (doorRows[i].controllername) nextController = doorRows[i].controllername;
    if (doorRows[i].IP_address) nextIP = doorRows[i].IP_address;
    if (!doorRows[i].controllername && nextController) doorRows[i].controllername = nextController;
    if (!doorRows[i].IP_address && nextIP) doorRows[i].IP_address = nextIP;
  }

  // (Optional) Remove rows that still have empty controllername or IP (they are orphan rows)
  const doorRowsFiltered = doorRows.filter((r) => r.controllername && r.IP_address && (r.Door || r.reader));

  // 6) Merge: for each controller from controllerData find all matching doorRowsFiltered
  const result = controllerData.map((ctrl) => {
    const ctrlName = sanitize(ctrl.controllername);
    const ctrlIP = sanitize(ctrl.IP_address);
    const ctrlLocation = sanitize(ctrl.Location);
    const ctrlCity = sanitize(ctrl.City);

    const doorsForCtrl = doorRowsFiltered.filter(
      (d) => d.controllername === ctrlName && d.IP_address === ctrlIP
    );

    const doorsList = doorsForCtrl.map((d) => ({
      Door: d.Door,
      Reader: d.reader
    }));

    return {
      controllername: ctrlName,
      IP_address: ctrlIP,
      Location: ctrlLocation,
      City: ctrlCity,
      Doors: doorsList
    };
  });

  // 7) Write JSON
  fs.writeFileSync(outputJsonPath, JSON.stringify(result, null, 4), "utf8");
  console.log("✅ JSON written to:", outputJsonPath);
} catch (err) {
  console.error("❌ Error:", err.message);
  console.error(err);
}