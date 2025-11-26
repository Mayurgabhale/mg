count is not chagne,,
    
use "Location": "APAC",
    "City": "Pune 2nd Floor", 

    
this is global 
not update:
TOTAL
1476
Cameras-9
Archivers-21
Controllers-71
CCURE-5
Door-698
Reader-645
Desktop-17
DB Server-10

this is apac ok 
TOTAL
1391
Cameras-9
Archivers-6
Controllers-13
CCURE-1
Door-698
Reader-645
Desktop-17
DB Server-2
http://localhost/api/controllers/status
[
  {
    "controllername": "IN-PUN-2NDFLR-ISTAR PRO",
    "IP_address": "10.199.13.10",
    "Location": "APAC",
    "City": "Pune 2nd Floor",
    "controllerStatus": "Online",
    "Doors": [
      {
        "Door": "APAC_IN_PUN_2NDFLR_IDF ROOM_10:05:86 Restricted Door",
        "Reader": "in:1",
        "status": "Online"
      },
      {
        "Door": "APAC_IN_PUN_2NDFLR_UPS/ELEC ROOM Restricted Door_10:05:FE",
        "Reader": "in:1",
        "status": "Online"
      },
      {
        "Door": "APAC_IN_PUN_2NDFLR_RECPTION TO WORKSTATION DOOR_10:05:4B",
        "Reader": "in:1",
        "status": "Online"
      },
      {
        "Door": "APAC_IN_PUN_2NDFLR_RECPTION TO WORKSTATION DOOR_10:05:4B",
        "Reader": "out:1",
        "status": "Online"
      },
      {
        "Door": "APAC_IN_PUN_2NDFLR_LIFTLOBBY TO RECEPTION EMTRY DOOR_10:05:74",
        "Reader": "in:1",
        "status": "Online"
      },
      {
        "Door": "APAC_IN_PUN_2NDFLR_LIFTLOBBY TO WORKSTATION DOOR_10:05:F0",
        "Reader": "",
        "status": "Online"
      }
    ]
  },
  {
    "controllername": "IN-PUN-PODIUM-ISTAR PRO-01",
    "IP_address": "10.199.8.20",
    "Location": "APAC",
    "City": "Pune Podium",
    "controllerStatus": "Online",
    "Doors": [
      {
        "Door": "APAC_IN-PUN-PODIUM-RED-RECREATION AREA FIRE EXIT 1-DOOR",
        "Reader": "",
        "status": "Online"
      },
      {
        "Door": "APAC_IN_PUN_PODIUM_RED_IDF ROOM-02-Restricted Door",
        "Reader": "in:1",

// --- Add this helper inside updateDetails (same scope as filterDevices) ---
function computeFilteredControllerExtras(selectedCity = "all", selectedStatus = "all") {
    const controllers = Array.isArray(window.controllerDataCached) ? window.controllerDataCached : [];
    const result = { doors: { total: 0, online: 0, offline: 0 }, readers: { total: 0, online: 0, offline: 0 } };

    if (!controllers || controllers.length === 0) return result;

    const cityFilterLower = (selectedCity || "all").toString().toLowerCase();
    const statusFilterLower = (selectedStatus || "all").toString().toLowerCase();

    controllers.forEach(ctrl => {
        // Skip if controller has no Doors
        if (!Array.isArray(ctrl.Doors) || ctrl.Doors.length === 0) return;

        // Apply city filter if any
        if (cityFilterLower !== "all") {
            const ctrlCity = (ctrl.City || ctrl.city || "").toString().toLowerCase();
            if (ctrlCity !== cityFilterLower) return;
        }

        // Apply status filter if any (match controllerStatus)
        if (statusFilterLower !== "all") {
            const ctrlStatus = (ctrl.controllerStatus || "").toString().toLowerCase();
            if (ctrlStatus !== statusFilterLower) return;
        }

        // Count doors/readers for this controller
        ctrl.Doors.forEach(d => {
            result.doors.total++;
            if ((d.status || "").toString().toLowerCase() === "online") result.doors.online++;

            if (d.Reader && d.Reader.toString().trim() !== "") {
                result.readers.total++;
                if ((d.status || "").toString().toLowerCase() === "online") result.readers.online++;
            }
        });
    });

    result.doors.offline = result.doors.total - result.doors.online;
    result.readers.offline = result.readers.total - result.readers.online;
    return result;
}










....
function filterDevices() {
    const selectedType = deviceFilter.value;
    const selectedStatus = document.querySelector(".status-filter.active")?.dataset.status || "all";
    const selectedCity = cityFilter.value;
    const vendorFilterLabel = document.getElementById("vendorFilterLabel");

    // toggle vendor UI
    vendorFilter.style.display = (deviceFilter.value === "cameras") ? "block" : "none";
    if (vendorFilterLabel) {
        vendorFilterLabel.style.display = vendorFilter.style.display;
    }

    // get vendor selection (if filter exists)
    const vendorFilterElem = document.getElementById("vendorFilter");
    const selectedVendor = vendorFilterElem ? vendorFilterElem.value : "all";

    // Search bar input
    const searchTerm = document.getElementById("device-search").value.toLowerCase();

    // Show/hide vendor filter based on type
    if (vendorFilterElem) {
        vendorFilterElem.style.display = (selectedType === "cameras") ? "block" : "none";
    }

    detailsContainer.innerHTML = "";

    const filteredDevices = allDevices.filter((device) =>
        (selectedType === "all" || device.dataset.type === selectedType) &&
        (selectedStatus === "all" || device.dataset.status === selectedStatus) &&
        (selectedCity === "all" || device.dataset.city === selectedCity) &&
        (selectedVendor === "all" || (device.dataset.vendor || "") === selectedVendor) &&
        (
            !searchTerm ||
            device.innerText.toLowerCase().includes(searchTerm)
        )
    );

    filteredDevices.forEach((deviceCard) => {
        detailsContainer.appendChild(deviceCard);
    });

    const region = currentRegion?.toUpperCase() || "GLOBAL";
    const titleElement = document.getElementById("region-title");

    const logoHTML = `
        <span class="region-logo">
            <a href="http://10.199.22.57:3014/" class="tooltip">
                <i class="fa-solid fa-house"></i>
                <span class="tooltiptext">Dashboard Hub</span>
            </a>
        </span>
        `;
    if (selectedCity !== "all") {
        titleElement.innerHTML = `${logoHTML}<span>${region}, ${selectedCity} Summary</span>`;
    } else {
        titleElement.innerHTML = `${logoHTML}<span>${region} Summary</span>`;
    }

    const filteredSummaryDevices = deviceObjects.filter((deviceObj, index) => {
        const correspondingCard = allDevices[index];
        return (
            (selectedType === "all" || correspondingCard.dataset.type === selectedType) &&
            (selectedStatus === "all" || correspondingCard.dataset.status === selectedStatus) &&
            (selectedCity === "all" || correspondingCard.dataset.city === selectedCity) &&
            (selectedVendor === "all" || (correspondingCard.dataset.vendor || "") === selectedVendor)
        );
    });

    const offlineDevices = filteredSummaryDevices
        .filter(d => d.status === "offline")
        .map(d => ({
            name: d.name || "Unknown",
            ip: d.ip,
            city: d.city,
            type: d.type,
            lastSeen: new Date().toISOString()
        }));

    if (window.updateOfflineChart) {
        window.updateOfflineChart(offlineDevices);
    }

    // Build the summary for filtered devices (counts by type)
    const summary = calculateCitySummary(filteredSummaryDevices);

    // --- NEW: compute controller door/reader counts for the current filters ---
    // We pass selectedCity and selectedStatus so door counts reflect the active filters.
    const controllerExtrasFiltered = computeFilteredControllerExtras(selectedCity, selectedStatus);
    if (!summary.summary) summary.summary = {};
    summary.summary.controllerExtras = controllerExtrasFiltered;

    // Update the summary UI (now includes filtered door/reader counts)
    updateSummary(summary);
}
