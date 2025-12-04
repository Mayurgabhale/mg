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

        // ✅ Set type correctly
        found._type_for_ui = detectTypeFromDeviceObj(found);

        // Open modal in edit mode
        showDeviceModal("edit", found);

    } catch (err) {
        console.error(err);
        alert("Cannot load device details: " + err.message);
    }
}