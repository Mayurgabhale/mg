
not work correct 
when i opne camer type so server 
and when i opne server type show controller 
Edit Device
Type*

Controller
Name*
BR-SAO PAULO-ISTAR ULTRA G2-PANEL 01
IP Address*
10.64.10.50
Location*
LACA
City*
Brazil
Details
Hyperlink
Remark
Person Name*
Doors & Readers
Door	Reader	Action
Add Door
Save Cancel Delete



Edit
WKSPUN-902213
 Abhishek Laptop

 WKSPUN-902213

 APAC

 Pune Podium

Online

Edit Device
Type*

Camera
Name*
WKSPUN-902213
IP Address*
WKSPUN-902213
Location*
APAC
City*
Pune Podium
Details
Hyperlink
Remark
Person Name*
    now this is pc

any thing type is show  in type this is wrong 
give me correct code and 
// ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️

// ================= SHOW DEVICE MODAL =================
function showDeviceModal(mode = "add", deviceObj = null) {
    const modal = document.getElementById("device-modal");
    const title = document.getElementById("device-modal-title");
    const deleteBtn = document.getElementById("device-delete-btn");

    document.getElementById("device-form").reset();
    document.getElementById("door-reader-body").innerHTML = "";
    document.getElementById("device-old-ip").value = "";

    if (mode === "add") {
        title.textContent = "Add Device";
        deleteBtn.style.display = "none";
        document.getElementById("device-type").disabled = false;
    } else {
        title.textContent = "Edit Device";
        deleteBtn.style.display = "inline-block";
        document.getElementById("device-type").disabled = true;

        // ✅ Set the Type dropdown correctly
        document.getElementById("device-type").value = deviceObj._type_for_ui || "camera";

        // Fill common fields
        const name = deviceObj.cameraname || deviceObj.controllername || deviceObj.archivername || deviceObj.servername || deviceObj.hostname || "";
        document.getElementById("device-name").value = name;
        document.getElementById("device-ip").value = deviceObj.IP_address || deviceObj.ip_address || "";
        document.getElementById("device-location").value = deviceObj.Location || deviceObj.location || "";
        document.getElementById("device-city").value = deviceObj.City || deviceObj.city || "";
        document.getElementById("device-details").value = deviceObj.device_details || "";
        document.getElementById("device-hyperlink").value = deviceObj.hyperlink || "";
        document.getElementById("device-remark").value = deviceObj.remark || "";
        document.getElementById("device-person").value = deviceObj.person_name || "";
        document.getElementById("device-old-ip").value = deviceObj.IP_address || deviceObj.ip_address || "";

        // ✅ Handle controller doors
        if (deviceObj.Doors && Array.isArray(deviceObj.Doors)) {
            updateFormFields(); // show doors section
            deviceObj.Doors.forEach(d => {
                addDoorRow(d.door || d.Door, d.reader || "");
            });
        }
    }

    updateFormFields(); // ensure doors section visibility is correct
    modal.style.display = "flex";
}

// ================= UPDATE FORM FIELDS BASED ON TYPE =================
function updateFormFields() {
    const type = document.getElementById("device-type").value;
    const doorSec = document.getElementById("door-reader-container");
    doorSec.style.display = (type === "controller") ? "block" : "none";
}


document.getElementById("device-type").addEventListener("change", updateFormFields);

function hideDeviceModal(){ document.getElementById("device-modal").style.display="none"; }

// ================= TYPE BASED FIELD =================
function updateFormFields(){
    const type = document.getElementById("device-type").value;
    const doorSec = document.getElementById("door-reader-container");
    doorSec.style.display = (type==="controller") ? "block" : "none";
}

// ================= DOOR ROW =================
function addDoorRow(door = "", reader = "") {
    const tbody = document.getElementById("door-reader-body");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="text" class="door-input" value="${door}"></td>
        <td><input type="text" class="reader-input" value="${reader}"></td>
        <td><button type="button" class="remove-door-row">X</button></td>
    `;
    tbody.appendChild(row);
    row.querySelector(".remove-door-row").addEventListener("click", () => row.remove());
}
document.getElementById("add-door-row").addEventListener("click", () => addDoorRow());


// ================= TYPE → BACKEND MAP =================
function mapUITypeToBackend(type){
    switch(type){
        case "camera": return "cameras";
        case "controller": return "controllers";
        case "archiver": return "archivers";
        case "server": return "servers";
        case "pcdetails": return "pcDetails";
        case "DBDetails": return "DBDetails";
        default: return "cameras";
    }
}

function convertToBackendFields(type, body){
    const mapped = {...body};
    switch(type){
        case "cameras": mapped.cameraname=body.name; break;
        case "controllers": mapped.controllername=body.name; break;
        case "archivers": mapped.archivername=body.name; break;
        case "servers": mapped.servername=body.name; break;
        case "pcDetails": mapped.hostname=body.name; break;
        case "DBDetails": mapped.hostname=body.name; break;
    }
    delete mapped.name;
    return mapped;
}

// ================= SAVE ADD/EDIT =================
document.getElementById("device-form").addEventListener("submit", async function (ev) {
    ev.preventDefault();

    const oldIp = document.getElementById("device-old-ip").value;
    const uiType = document.getElementById("device-type").value;
    const backendType = mapUITypeToBackend(uiType);

    let body = {
        name: document.getElementById("device-name").value,
        ip_address: document.getElementById("device-ip").value,
        location: document.getElementById("device-location").value,
        city: document.getElementById("device-city").value,
        device_details: document.getElementById("device-details").value,
        hyperlink: document.getElementById("device-hyperlink").value,
        remark: document.getElementById("device-remark").value,
        person_name: document.getElementById("device-person").value
    };

    body = convertToBackendFields(backendType, body);

    if (backendType === "controllers") {
        const doors = [];
        document.querySelectorAll("#door-reader-body tr").forEach(tr => {
            doors.push({
                door: tr.querySelector(".door-input").value,
                reader: tr.querySelector(".reader-input").value
            });
        });
        body.Doors = doors;
    }

    try {
        if (!oldIp) {
            await fetch("http://localhost/api/devices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: backendType, device: body })
            });
        } else {
            await fetch(`http://localhost/api/devices/${encodeURIComponent(oldIp)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
        }

        alert("Saved successfully!");
        hideDeviceModal();
        await fetchData(currentRegion);

    } catch (err) {
        alert("Error saving device: " + err.message);
    }
});
// ================= OPEN EDIT BY IP OR HOSTNAME =================
// ================= OPEN EDIT BY IP OR HOSTNAME =================
async function openEditForDeviceFromIP(ipOrHost) {
    try {
        // Ensure devices are loaded
        if (!latestDetails || !latestDetails.details) {
            await fetchData(currentRegion);
        }

        let found = null;

        // Search all device lists
        for (const list of Object.values(latestDetails.details)) {
            const m = (list || []).find(d =>
                (d.ip_address || d.IP_address || "").trim() === ipOrHost ||
                (d.hostname || d.HostName || "").trim() === ipOrHost
            );
            if (m) {
                found = m;
                break;
            }
        }

        if (!found) {
            alert("Device not found");
            return;
        }

        // Detect type
        found._type_for_ui = detectTypeFromDeviceObj(found);

        // Open modal in edit mode
        showDeviceModal("edit", found);

    } catch (err) {
        console.error(err);
        alert("Cannot load device details: " + err.message);
    }
}

// ================= DETECT DEVICE TYPE =================
function detectTypeFromDeviceObj(obj) {
    if (obj.cameraname) return "camera";
    if (obj.controllername) return "controller";
    if (obj.archivername) return "archiver";
    if (obj.servername) return "server";
    if (obj.hostname && obj.is_pc_details) return "pcdetails";
    if (obj.hostname && obj.is_db_details) return "DBDetails";
    return "camera"; // fallback
}


function updateDetails(data) {
    const detailsContainer = document.getElementById("device-details");
    const deviceFilter = document.getElementById("device-filter");
    const onlineFilterButton = document.getElementById("filter-online");
    const offlineFilterButton = document.getElementById("filter-offline");
    const allFilterButton = document.getElementById("filter-all");
    const cityFilter = document.getElementById("city-filter");



    detailsContainer.innerHTML = "";
    cityFilter.innerHTML = '<option value="all">All Cities</option>';

    let combinedDevices = [];
    let citySet = new Set();
    let vendorSet = new Set(); // collect normalized vendor values
    let typeCityMap = {}; // <-- NEW: map deviceType -> Set of cities

    // Icon utility based on device type
    function getDeviceIcon(type = "") {
        type = type.toLowerCase();
        if (type.includes("camera")) return "fas fa-video";
        if (type.includes("controller")) return "fas fa-cogs";
        if (type.includes("archiver")) return "fas fa-database";
        if (type.includes("server")) return "fas fa-server";
        if (type.includes("pc")) return "fas fa-desktop";
        if (type.includes("dbdetails")) return "fa-solid fa-life-ring";
        return "fas fa-microchip"; // fallback
    }



    // Helper to find matching controller (by IP or name)
    function findControllerForDevice(device) {
        const controllers = Array.isArray(window.controllerDataCached) ? window.controllerDataCached : null;
        const ipToMatch = (device.ip || device.ip_address || "").toString().trim();
        const nameToMatch = (device.controllername || device.controller_name || device.cameraname || "").toString().trim();

        if (controllers) {
            // Try IP match first
            if (ipToMatch) {
                const byIp = controllers.find(c => c.IP_address && c.IP_address.toString().trim() === ipToMatch);
                if (byIp) return byIp;
            }
            // Try controller name match (loose contains)
            if (nameToMatch) {
                const nameLower = nameToMatch.toLowerCase();
                const byName = controllers.find(c => (c.controllername || "").toLowerCase().includes(nameLower) || nameLower.includes((c.controllername || "").toLowerCase()));
                if (byName) return byName;
            }
            // Last resort: try city match + online status (heuristic)
            if (device.city) {
                const byCity = controllers.find(c => (c.City || "").toLowerCase() === (device.city || "").toLowerCase());
                if (byCity) return byCity;
            }
        }
        return null;
    }

    // If controllers aren't cached, we will fetch them when necessary (lazy)
    function ensureControllersCached() {
        if (Array.isArray(window.controllerDataCached)) return Promise.resolve(window.controllerDataCached);
        return fetch("http://localhost/api/controllers/status")
        // return fetch("http://10.138.161.4:3000/api/controllers/status")
            .then(res => res.json())
            .then(data => {
                window.controllerDataCached = Array.isArray(data) ? data : null;
                return window.controllerDataCached;
            })
            .catch(err => {
                console.error("Failed to fetch controllers:", err);
                return null;
            });
    }


    // Fetch real-time status if available.
    fetch("http://localhost:80/api/region/devices/status")
    // fetch("http://10.138.161.4:3000/api/region/devices/status")
        .then((response) => response.json())
        .then((realTimeStatus) => {
            // console.log("Live Status Data:", realTimeStatus);

            for (const [key, devices] of Object.entries(data.details)) {
                if (!Array.isArray(devices) || devices.length === 0) continue;
                const deviceType = key.toLowerCase();

                // ensure map entry exists
                if (!typeCityMap[deviceType]) typeCityMap[deviceType] = new Set();

                devices.forEach((device) => {
                    const deviceIP = device.ip_address || "N/A";
                    let currentStatus = (realTimeStatus[deviceIP] || device.status || "offline").toLowerCase();
                    const city = device.city || "Unknown";

                    // collect city globally and per device type
                    citySet.add(city);
                    typeCityMap[deviceType].add(city);

                    // --- VENDOR: read possible fields, normalize, skip empty/unknown ---
                    // NOTE: your JSON uses the key "deviec_details" (typo) — we read that first.
                    let rawVendor = device.deviec_details || device.device_details || (device.device_details && device.device_details.vendor) || device.vendor || device.vendor_name || device.manufacturer || "";
                    rawVendor = (rawVendor || "").toString().trim();

                    // Normalize: empty -> null, otherwise uppercase for consistent set values
                    let vendorNormalized = rawVendor ? rawVendor.toUpperCase() : null;

                    // Only add real vendors (skip "UNKNOWN", "", null)
                    if (vendorNormalized && vendorNormalized !== "UNKNOWN") {
                        vendorSet.add(vendorNormalized);
                    }

                    const datasetVendorValue = vendorNormalized || "";

                    // Create card element.
                    const card = document.createElement("div");
                    card.className = "device-card";
                    card.dataset.type = deviceType;
                    card.dataset.status = currentStatus;
                    card.dataset.city = city;
                    if (datasetVendorValue) card.dataset.vendor = datasetVendorValue; // only set if valid
                    card.setAttribute("data-ip", deviceIP);

                    // Apply background color based on online/offline status (kept your placeholders)
                    card.style.backgroundColor = currentStatus === "online" ? "" : "";
                    card.style.borderColor = currentStatus === "online" ? "" : "";

                    // Create a container for status
                    const statusContainer = document.createElement("p");
                    statusContainer.className = "device-status";

                    // Status text
                    const statusText = document.createElement("span");
                    statusText.className = "status-text";
                    statusText.textContent = currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1);
                    statusText.style.color = currentStatus === "online" ? "green" : "red";

                    // Status dot
                    const statusDot = document.createElement("span");
                    statusDot.classList.add(currentStatus === "online" ? "online-dot" : "offline-dot");
                    statusDot.style.backgroundColor = (currentStatus === "online") ? "green" : "red";
                    statusDot.style.display = "inline-block";
                    statusDot.style.width = "10px";
                    statusDot.style.height = "10px";
                    statusDot.style.marginLeft = "5px";
                    statusDot.style.marginRight = "5px";
                    statusDot.style.borderRadius = "50%";

                    // Combine status parts
                    statusContainer.appendChild(statusDot);
                    statusContainer.appendChild(statusText);

                    // compute a nicer label for the device-type area
                    let deviceLabel;

                    if (deviceType === "dbdetails") {
                        // For DB Details: show the application if available, else fallback
                        deviceLabel = device.application || deviceType.toUpperCase();
                    } else if (deviceType.includes("pc")) {
                        deviceLabel = device.pc_name || device.hostname || "PC";
                    } else {
                        deviceLabel = deviceType.toUpperCase();
                    }

                    card.insertAdjacentHTML("beforeend", `
                        <button class="edit-device-btn" onclick="openEditForDeviceFromIP('${deviceIP}')"
  style="margin-left:8px; padding:6px 8px;">Edit</button>
  <h3 class="device-name" style="font-size:20px; font-weight:500; font-family: PP Right Grotesk; margin-bottom: 10px;">
      ${device.cameraname || device.controllername || device.archivername || device.servername || device.hostname || "Unknown Device"}
  </h3>

  <div class="card-content">
      <p class="device-type-label ${deviceType}" 
         style="font-size:17px;  font-family: Roboto; font-weight:100; margin-bottom: 10px; display:flex; justify-content:space-between; align-items:center;">
          
          <strong>
            <i class="${getDeviceIcon(deviceType)}" style="margin-right: 5px;"></i> 
            ${deviceLabel}
          </strong>
          
          ${deviceType.includes("camera")
                            ? `<button class="open-camera-btn"
        onclick="openCamera('${deviceIP}', '${(device.cameraname || device.controllername || "").replace(/'/g, "\\'")}', '${device.hyperlink || ""}')"
        title="Open Camera"
        style="border:none; cursor:pointer; font-weight:100; border-radius:50%; width:34px; height:34px; display:flex; justify-content:center; align-items:center;">
    <img src="images/cctv.png" alt="Logo" style="width:33px; height:33px;"/>
</button>`
                            : ""
                        }
      </p>

      <p style="font-size: ;  font-family: Roboto; margin-bottom: 8px;">
          <strong style="color:rgb(8, 8, 8);"><i class="fas fa-network-wired" style="margin-right: 6px;"></i></strong>
          <span 
              class="device-ip" 
              style="font-weight:100; color: #00adb5; cursor: pointer; text-shadow: 0 0 1px rgba(0, 173, 181, 0.3);  font-family: Roboto;"
              onclick="copyToClipboard('${deviceIP}')"
              title="Click to copy IP"
          >
              ${deviceIP}
          </span>
      </p>

      <p style="font-size: ;  font-family: Roboto; margin-bottom: 6px;">
          <strong ><i class="fas fa-map-marker-alt" style="margin-right: 5px;"></i></strong>
          <span style="font-size:; font-weight:100; margin-left: 12px;  font-family: Roboto; font-size: ;">${device.location || "N/A"}</span>
      </p>

      <p style="font-size:;  font-family: Roboto;>
          <strong "><i class="fas fa-city" style="margin-right: 5px;"></i></strong>
          <span style="font-weight:100;margin-left: 4px;  font-family: Roboto; font-size:;">${city}</span>
      </p>
  </div>
`);
                    card.appendChild(statusContainer);

                    // --- ADDED: if this is a controller card, attach click to open doors modal ---
                    if (deviceType.includes("controller")) {
                        card.style.cursor = "pointer";
                        card.title = "Click to view Doors for this controller";
                        card.setAttribute("role", "button");
                        card.setAttribute("tabindex", "0");

                        // click handler that uses cached controllers when possible
                        const openControllerDoors = async () => {
                            // try to find matching controller from cache
                            let ctrl = findControllerForDevice({ ip: deviceIP, controllername: device.controllername, city: city });
                            if (!ctrl) {
                                // ensure controllers are cached then try again
                                await ensureControllersCached();
                                ctrl = findControllerForDevice({ ip: deviceIP, controllername: device.controllername, city: city });
                            }
                            if (ctrl) {
                                showDoorsReaders(ctrl);
                            } else {
                                // fallback: open controllers list then highlight nearest by city/IP
                                loadControllersInDetails();
                                // show a quick toast/message to indicate we couldn't find exact match
                                console.warn("Controller details not found in cache for IP/name:", deviceIP, device.controllername);
                            }
                        };

                        card.addEventListener("click", (ev) => {
                            openControllerDoors();
                        });

                        // keyboard accessibility (Enter / Space)
                        card.addEventListener("keydown", (ev) => {
                            if (ev.key === "Enter" || ev.key === " ") {
                                ev.preventDefault();
                                openControllerDoors();
                            }
                        });
                    }
                    // --- END ADDED CLICK HANDLER ---

                    // --- show policy tooltip for devices marked "Not accessible" ---
                    const remarkText = (device.remark || "").toString().trim();
                    i

                        card.title = tooltip.textContent;
                    }

                    // push device with normalized vendor (may be empty string if unknown)
                    combinedDevices.push({
                        card: card,
                        device: {
                            ip: deviceIP,
                            type: deviceType,
                            status: currentStatus,
                            city: city,
                            vendor: datasetVendorValue // already normalized (uppercase) or ""
                        }
                    });
                });
            }

            combinedDevices.sort((a, b) => {
                const statusA = (a.device.status === "offline") ? 0 : 1;
                const statusB = (b.device.status === "offline") ? 0 : 1;
                return statusA - statusB;
            });

            const allDevices = combinedDevices.map(item => item.card);
            const deviceObjects = combinedDevices.map(item => item.device);

            // --- NEW: function to populate city select based on selected device type ---
            function populateCityOptions(selectedType = "all") {
                // preserve current selected city if possible
                const prevSelected = cityFilter.value;

                cityFilter.innerHTML = '<option value="all">All Cities</option>';

                let citiesToShow = new Set();

                if (!selectedType || selectedType === "all") {
                    citiesToShow = citySet;
                } else {
                    const setForType = typeCityMap[selectedType];
                    if (setForType && setForType.size > 0) {
                        citiesToShow = setForType;
                    } else {
                        // no cities for selected type -> keep empty (except "All Cities")
                        citiesToShow = new Set();
                    }
                }

                // Add cities in sorted order for stable UI
                Array.from(citiesToShow).sort().forEach((city) => {
                    const option = document.createElement("option");
                    option.value = city;
                    option.textContent = city;
                    cityFilter.appendChild(option);
                });

                // restore previous if still valid, otherwise set to 'all'
                if (prevSelected && Array.from(citiesToShow).includes(prevSelected)) {
                    cityFilter.value = prevSelected;
                } else {
                    cityFilter.value = "all";
                }
            }

            // populate vendor options
            let vendorFilter = document.getElementById("vendorFilter");
            if (!vendorFilter) {
                vendorFilter = document.createElement("select");
                vendorFilter.id = "vendorFilter";
                vendorFilter.style.marginTop = "8px";
                deviceFilter.parentNode.insertBefore(vendorFilter, cityFilter);
            }

            vendorFilter.innerHTML = `<option value="all">All camera</option>`;
            [...vendorSet].sort().forEach(v => {
                if (!v) return;
                const opt = document.createElement("option");
                opt.value = v;
                opt.textContent = v;
                vendorFilter.appendChild(opt);
            });

            // hide vendor filter by default unless cameras selected
            vendorFilter.style.display = (deviceFilter.value === "cameras") ? "block" : "none";

            vendorFilter.onchange = filterDevices; // uses filterDevices defined below

            // Build initial city options for the current deviceFilter selection
            populateCityOptions(deviceFilter.value || "all");

            // avoid duplicate listeners on repeated updates
            deviceFilter.value = "all";
            cityFilter.value = "all";
            document.querySelectorAll(".status-filter").forEach(btn => btn.classList.remove("active"));
            allFilterButton.classList.add("active");


            // new -----
            // --- Add this helper inside updateDetails (same scope as filterDevices) ---
            


            function c
            console.error("Error fetching real-time device status:", error);
            detailsContainer.innerHTML = "<p>Failed to load device details.</p>";
        });
}



