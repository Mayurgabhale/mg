// ---------- Helper: case-insensitive getter for many possible keys ----------
function pick(...objs) {
  // usage: pick(deviceObj, ['hostname','HostName','db_hostname'], '')
  const obj = objs[0] || {};
  const keys = Array.isArray(objs[1]) ? objs[1] : [];
  const fallback = objs[2] === undefined ? "" : objs[2];
  for (const k of keys) {
    if (k == null) continue;
    // try exact key
    if (obj[k] !== undefined && obj[k] !== null) return obj[k];
    // try lowercase normalized key
    const lower = k.toString().toLowerCase();
    for (const ok of Object.keys(obj)) {
      if (ok.toString().toLowerCase() === lower) {
        return obj[ok];
      }
    }
  }
  return fallback;
}

// ---------- Detect UI type from device object (best-effort) ----------
function detectTypeFromDeviceObj(device) {
  if (!device || typeof device !== "object") return "camera";
  // If explicit hint was stored
  if (device._type_for_ui) return device._type_for_ui.toString().toLowerCase();

  // Heuristics: prefer controller if Doors exist
  if (Array.isArray(device.Doors) && device.Doors.length) return "controller";

  // Fields that identify DB
  const hasDb = !!(pick(device, ["hostname", "db_hostname", "host_name"]) &&
                   (pick(device, ["application", "Application"]) || pick(device, ["windows_server", "WindowsServer"])));
  if (hasDb) return "dbdetails";

  if (device.cameraname || device.camera_name || device.devicetype === "camera") return "camera";
  if (device.controllername || device.controller_name) return "controller";
  if (device.archivername || device.archiver_name) return "archiver";
  if (device.servername || device.server_name) return "server";
  if (device.pc_name || device.pcnname || device.hostname) return "pcdetails";

  return "camera";
}

// ---------- UPDATE FORM FIELDS BASED ON TYPE ----------
function updateFormFields() {
  const type = (document.getElementById("device-type").value || "").toString().toLowerCase();

  const nameField = document.getElementById("name-field");
  const cameraFields = document.getElementById("camera-fields");
  const pcFields = document.getElementById("pc-fields");
  const doorSec = document.getElementById("door-reader-container");
  const dbFields = document.getElementById("db-fields");

  // RESET ALL
  nameField.style.display = "block";
  cameraFields.style.display = "none";
  pcFields.style.display = "none";
  doorSec.style.display = "none";
  if (dbFields) dbFields.style.display = "none";

  if (type === "camera") {
    cameraFields.style.display = "block";
  } else if (type === "controller") {
    doorSec.style.display = "block";
  } else if (type === "pcdetails") {
    nameField.style.display = "none";
    pcFields.style.display = "block";
  } else if (type === "dbdetails") {
    // show only DB fields
    nameField.style.display = "none";
    pcFields.style.display = "none";
    cameraFields.style.display = "none";
    doorSec.style.display = "none";
    if (dbFields) dbFields.style.display = "block";
  }
}

// keep your listener
document.getElementById("device-type").addEventListener("change", updateFormFields);

// ---------- Populate fields for a given type (safe, uses pick() for keys) ----------
function populateFieldsForType(mode, deviceObj = null, userName = "") {
  // common fields
  document.getElementById("device-name").value =
    pick(deviceObj || {}, ["cameraname", "controllername", "archivername", "servername", "name", "hostname"], "");

  document.getElementById("device-ip").value = pick(deviceObj || {}, ["IP_address", "ip_address", "ip"], "");
  document.getElementById("device-location").value = pick(deviceObj || {}, ["Location", "location"], "");
  document.getElementById("device-city").value = pick(deviceObj || {}, ["City", "city"], "");
  document.getElementById("device-details").value = pick(deviceObj || {}, ["device_details", "deviec_details", "details"], "");
  document.getElementById("device-hyperlink").value = pick(deviceObj || {}, ["hyperlink", "link"], "");
  document.getElementById("device-remark").value = pick(deviceObj || {}, ["remark", "notes"], "");
  document.getElementById("device-old-ip").value = pick(deviceObj || {}, ["IP_address", "ip_address", "ip"], "");

  // PC fields
  document.getElementById("Host-Name").value = pick(deviceObj || {}, ["hostname", "HostName", "db_hostname", "host_name"], "");
  document.getElementById("PC-Name").value = pick(deviceObj || {}, ["pc_name", "PCName", "pcname"], "");

  // DB fields: NOTE: fill these AFTER updateFormFields() has been called so inputs are visible
  document.getElementById("db-hostname").value = pick(deviceObj || {}, ["hostname", "db_hostname", "HostName", "host_name"], "");
  document.getElementById("db-application").value = pick(deviceObj || {}, ["application", "Application", "app", "App"], "");
  document.getElementById("db-windows-server").value = pick(deviceObj || {}, ["windows_server", "WindowsServer", "Windows_Server"], "");

  // Doors (controller)
  if (deviceObj && Array.isArray(deviceObj.Doors)) {
    // clear existing rows then add
    document.getElementById("door-reader-body").innerHTML = "";
    deviceObj.Doors.forEach(d => addDoorRow(pick(d, ["door", "Door", "name"], ""), pick(d, ["reader", "Reader"], "")));
  }
}

// ---------- SHOW DEVICE MODAL (clean, robust) ----------
function showDeviceModal(mode = "add", deviceObj = null, userName = "") {
  const modal = document.getElementById("device-modal");
  const title = document.getElementById("device-modal-title");
  const deleteBtn = document.getElementById("device-delete-btn");

  // Reset form (clear inputs)
  document.getElementById("device-form").reset();
  document.getElementById("door-reader-body").innerHTML = "";
  document.getElementById("device-old-ip").value = "";

  // default UI state
  const addedBox = document.getElementById("added-by-box");
  const updatedBox = document.getElementById("updated-by-box");
  const addedInput = document.getElementById("device-added-by");
  const updatedInput = document.getElementById("device-updated-by");

  // default added/updated boxes
  addedBox.style.display = "none";
  updatedBox.style.display = "none";
  addedInput.value = "";
  updatedInput.value = "";

  if (mode === "add") {
    title.textContent = "Add Device";
    deleteBtn.style.display = "none";
    document.getElementById("device-type").disabled = false;
    document.getElementById("device-type").value = "camera";

    // show added-by for adds
    addedBox.style.display = "block";
    addedInput.value = userName || "";
    addedInput.readOnly = false;
  } else if (mode === "edit" && deviceObj) {
    title.textContent = "Edit Device";
    deleteBtn.style.display = "inline-block";
    document.getElementById("device-type").disabled = true;

    // determine UI type (use stored hint or detect)
    const uiType = (deviceObj._type_for_ui || detectTypeFromDeviceObj(deviceObj) || "camera").toString().toLowerCase();
    // set select value to known option names in your dropdown (camera, archiver, controller, server, pcdetails, dbdetails)
    // normalize 'pcdetails' vs 'pcDetails' etc.
    const normalizedUiType = uiType === "pcdetails" || uiType === "pc" ? "pcdetails" : uiType;
    document.getElementById("device-type").value = normalizedUiType;

    // Now show/hide the correct set of fields BEFORE we populate values
    updateFormFields();

    // populate values for visible inputs
    populateFieldsForType(mode, deviceObj, userName);

    // Added / Updated metadata boxes
    addedBox.style.display = "block";
    updatedBox.style.display = "block";

    addedInput.value = pick(deviceObj, ["added_by","AddedBy","addedBy","addedby"], "Unknown");
    addedInput.readOnly = true;

    updatedInput.value = pick(deviceObj, ["updated_by","UpdatedBy","updatedBy","updatedby"], "");
    updatedInput.readOnly = false;
  }

  // If add mode: ensure fields reflect 'camera' default
  if (mode === "add") {
    updateFormFields();
    // ensure added_by prefilled already done above
  }

  // Finally display modal
  modal.style.display = "flex";
}

// ---------- Convert UI fields to backend-friendly device object ----------
function convertToBackendFields(type, body) {
  // `type` is backend type as returned by mapUITypeToBackend (e.g., 'cameras','controllers','archivers','servers','pcDetails','dbdetails')
  const mapped = { ...body };

  // Ensure we accept both UI keys and direct DB field keys
  const t = (type || "").toString();

  switch (t) {
    case "cameras":
      mapped.cameraname = body.name || body.cameraname || null;
      break;
    case "controllers":
      mapped.controllername = body.name || body.controllername || null;
      break;
    case "archivers":
      mapped.archivername = body.name || body.archivername || null;
      break;
    case "servers":
      mapped.servername = body.name || body.servername || null;
      break;
    case "pcDetails":
    case "pc_details":
      // backend expects hostname + pc_name
      mapped.hostname = body.hostname || body.HostName || body.db_hostname || null;
      mapped.pc_name = body.pc_name || body.PCName || null;
      break;
    case "dbdetails":
      // backend expects hostname, application, windows_server
      // UI uses db-hostname input; prefer that, fallback to hostname
      mapped.hostname = body.db_hostname || body.hostname || body.HostName || null;
      mapped.application = body.application || body.app || null;
      mapped.windows_server = body.windows_server || body.windowsServer || null;
      break;
    default:
      // no special mapping; keep as-is
      break;
  }

  // Remove 'name' to avoid confusion
  delete mapped.name;
  return mapped;
}