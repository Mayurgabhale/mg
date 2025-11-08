controller not popup controler disply in  
 div id="device-details" class="device-grid">Loading...</div>
                <div id="details-container" class="device-grid"></div> this ok in content 
 
<!-- Main Content -->
        <main id="content">
            
            <section id="details-section" class="details-section">
                <div class="details-header">
                    <h2><i class="fas fa-microchip"></i> Device Details</h2>
                    <input type="text" id="device-search" placeholder="🔍 Search by IP, Location, City..." />
                </div>

                <div id="device-details" class="device-grid">Loading...</div>
                <div id="details-container" class="device-grid"></div>
            </section>

        </main>



        if (document.getElementById("doorReader-total")) document.getElementById("doorReader-total").textContent = 0;
        if (document.getElementById("doorReader-online")) document.getElementById("doorReader-online").textContent = 0;
        if (document.getElementById("doorReader-offline")) document.getElementById("doorReader-offline").textContent = 0;
    }

    if (extras.readers) {
        const rTotalEl = document.getElementById("reader-total-inline");
        const rOnlineEl = document.getElementById("reader-online-inline");
        const rOfflineEl = document.getElementById("reader-offline-inline");
        // NOTE: your HTML currently has the Door/Reader card as a single combined card.
        // If you want to surface readers separately on the same card, you can add spans with these IDs
        // inside the card or reuse the same doorReader-* elements. For now we only populate doorReader-*.
        // Keep these lines if you create these spans, otherwise they're safe (will be null).
        if (rTotalEl) rTotalEl.textContent = extras.readers.total || 0;
        if (rOnlineEl) rOnlineEl.textContent = extras.readers.online || 0;
        if (rOfflineEl) rOfflineEl.textContent = extras.readers.offline || 0;
    }
}

/*
   Updated updateDetails:
   Each device card is built with separate elements for the status dot and status text.
   This ensures that later updates from pingAllDevices can reliably find and update them.
*/



// /////////////////////////////

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

    // Fetch real-time status if available.
    fetch("http://localhost:80/api/region/devices/status")
        .then((response) => response.json())
        .then((realTimeStatus) => {
            console.log("Live Status Data:", realTimeStatus);

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
          <strong style="color: rgb(13, 13, 13);"><i class="fas fa-map-marker-alt" style="margin-right: 5px;"></i></strong>
          <span style="font-size:; font-weight:100; color: rgb(8, 9, 9); margin-left: 12px;  font-family: Roboto; font-size: ;">${device.location || "N/A"}</span>
      </p>

      <p style="font-size:;  font-family: Roboto;>
          <strong style="color: rgb(215, 217, 222);"><i class="fas fa-city" style="margin-right: 5px;"></i></strong>
          <span style="font-weight:100; color: rgb(7, 7, 7); margin-left: 4px;  font-family: Roboto; font-size:;">${city}</span>
      </p>
  </div>
`);
