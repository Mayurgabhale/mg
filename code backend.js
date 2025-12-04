async function openEditForDeviceFromIP(ipOrHost, detectedType = null) {
    try {
        if (!latestDetails || !latestDetails.details) {
            await fetchData(currentRegion); // fetch devices if not loaded
        }

        let found = null;

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

        // Use detected type from button if passed, otherwise detect from object
        found._type_for_ui = detectedType || detectTypeFromDeviceObj(found);

        showDeviceModal("edit", found);

    } catch (err) {
        console.error(err);
        alert("Cannot load device details: " + err.message);
    }
}