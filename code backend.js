
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
                        <button class="edit-device-btn" 
                            onclick="openEditForDeviceFromIP('${deviceIP}', '${detectTypeFromDeviceObj(device)}')"
                            style="margin-left:8px; padding:4px;">
                            <i class="bi bi-pencil-square"></i>
                        </button>
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
                    </button>`: ""}
                    </p>

                    <p style="font-size: ;  font-family: Roboto; margin-bottom: 8px;">
                    <strong style="color:rgb(8, 8, 8);"><i class="fas fa-network-wired" style="margin-right: 6px;"></i></strong>
                        <span 
                        class="device-ip" 
                        style="font-weight:100; color: #00adb5; cursor: pointer; text-shadow: 0 0 1px rgba(0, 173, 181, 0.3);  font-family: Roboto;"
                        onclick="copyToClipboard('${deviceIP}')"
                        title="Click to copy IP">
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
                            
function detectTypeFromDeviceObj(obj) {
    // Cameras
    if (obj.cameraname) return "camera";

    // Controllers
    if (obj.controllername) return "controller";

    // Archivers
    if (obj.archivername) return "archiver";

    // Servers
    if (obj.servername) return "server";

    // DB machines always have DatabaseName OR DBDetails field
    if (obj.databasename || obj.DBname || obj.db_name) return "DBDetails";

    // PC machines have hostname but NOT database fields
    if (obj.hostname || obj.HostName) return "pcdetails";

    return "camera"; // fallback
}
