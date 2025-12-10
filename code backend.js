<button class="edit-device-btn" 
                            onclick="openEditForDeviceFromIP('${deviceIP}', '${detectTypeFromDeviceObj(device)}')"
                            style="margin-left:8px; padding:4px;">
                            <i class="bi bi-pencil-square"></i>
                        </button>
status right side 
this buttion i want to add 
and buttin is diplsy when i hover on the card only that time  this is disply ok 
WKSWUPUN2709
 GSOC Laptop

 WKSWUPUN2709

 APAC

 Pune Podium

Offline       .. in this 


Archiver Manila
 ARCHIVERS

 10.193.132.8

 APAC

 Taguig City

Online       .. in this 


Archiver Taguig City Philippines
 ARCHIVERS

 10.194.2.190

 APAC

 Taguig City

Online  .. in this 

 
<button class="edit-device-btn" 
                            onclick="openEditForDeviceFromIP('${deviceIP}', '${detectTypeFromDeviceObj(device)}')"
                            style="margin-left:8px; padding:4px;">
                            <i class="bi bi-pencil-square"></i>
                        </button>



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
                    if (remarkText && /not\s+access/i.test(remarkText)) {
                        if (!card.style.position) card.style.position = "relative";

                        const tooltip = document.createElement("div");
                        tooltip.className = "device-access-tooltip";
                        tooltip.textContent = "Due to Network policy, this camera is Not accessible";

                        tooltip.style.position = "absolute";
                        tooltip.style.bottom = "100%";
                        tooltip.style.left = "8px";
                        tooltip.style.padding = "6px 8px";
                        tooltip.style.background = "rgba(0,0,0,0.85)";
                        tooltip.style.color = "#fff";
                        tooltip.style.borderRadius = "4px";
                        tooltip.style.fontSize = "12px";
                        tooltip.style.whiteSpace = "nowrap";
                        tooltip.style.pointerEvents = "none";
                        tooltip.style.opacity = "0";
                        tooltip.style.transform = "translateY(-6px)";
                        tooltip.style.transition = "opacity 0.12s ease, transform 0.12s ease";
                        tooltip.style.zIndex = "999";

                        card.appendChild(tooltip);

                        card.addEventListener("mouseenter", () => {
                            tooltip.style.opacity = "1";
                            tooltip.style.transform = "translateY(-10px)";
                        });
                        card.addEventListener("mouseleave", () => {
                            tooltip.style.opacity = "0";
                            tooltip.style.transform = "translateY(-6px)";
                        });

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
