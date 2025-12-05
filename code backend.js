document.getElementById("device-form").addEventListener("submit", async function (ev) {
    ev.preventDefault();

    const oldIp = document.getElementById("device-old-ip").value;
    const uiType = document.getElementById("device-type").value;
    const backendType = mapUITypeToBackend(uiType);

    // Collect all fields
    let body = {
        name: document.getElementById("device-name").value,
        ip_address: document.getElementById("device-ip").value,
        location: document.getElementById("device-location").value,
        city: document.getElementById("device-city").value,
        device_details: document.getElementById("device-details").value,
        hyperlink: document.getElementById("device-hyperlink").value,
        remark: document.getElementById("device-remark").value,
        added_by: document.getElementById("device-added-by").value,
        updated_by: document.getElementById("device-updated-by").value
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
            // ADD new device
            await fetch("http://localhost/api/devices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: backendType, device: body })
            });
        } else {
            // UPDATE existing device
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