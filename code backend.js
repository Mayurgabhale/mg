function mapUITypeToBackend(type) {
    switch (type) {
        case "camera": return "cameras";
        case "controller": return "controllers";
        case "archiver": return "archivers";
        case "server": return "servers";
        case "pcdetails": return "pc_details";   // changed
        case "dbdetails": return "dbdetails";
        default: return "cameras";
    }
}


....

function convertToBackendFields(type, body) {
    const mapped = { ...body };

    switch (type) {
        case "cameras":
            mapped.cameraname = body.name;
            break;
        case "controllers":
            mapped.controllername = body.name;
            break;
        case "archivers":
            mapped.archivername = body.name;
            break;
        case "servers":
            mapped.servername = body.name;
            break;

        case "pc_details":  // backend type
            // backend/DB expects column `hostname` and `pc_name`
            mapped.hostname = body.hostname;
            mapped.pc_name = body.pc_name;
            break;

        case "dbdetails":
            // map `db-hostname` form → backend `hostname`
            mapped.hostname = body.db_hostname || body.hostname || "";
            mapped.application = body.application;
            mapped.windows_server = body.windows_server;
            break;
    }

    delete mapped.name;
    return mapped;
}

...


try {
    // DEBUG - show exactly what we send
    console.log("Submitting device", { type: backendType, device: body });

    let resp;
    if (!oldIp) {
        // ADD new device
        resp = await fetch("http://localhost/api/devices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: backendType, device: body })
        });
    } else {
        // UPDATE existing device
        resp = await fetch(`http://localhost/api/devices/${encodeURIComponent(oldIp)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
    }

    // Check response
    const respText = await resp.text();
    console.log("Server response:", resp.status, respText);

    if (!resp.ok) {
        throw new Error(`Server returned ${resp.status}: ${respText}`);
    }

    alert("Saved successfully!");
    hideDeviceModal();
    await fetchData(currentRegion);
} catch (err) {
    console.error("Error saving device:", err);
    alert("Error saving device: " + err.message);
}