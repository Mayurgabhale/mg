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