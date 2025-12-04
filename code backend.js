async function openEditForDeviceFromIP(ip) {
    try {
        const res = await fetch(`http://localhost/api/devices/${ip}`);

        if (!res.ok) {
            throw new Error(`Device not found: ${res.status}`);
        }

        const deviceObj = await res.json();

        // detect type from returned object
        let type = "";
        if (deviceObj.cameraname) type = "camera";
        else if (deviceObj.controllername) type = "controller";
        else if (deviceObj.archivername) type = "archiver";
        else if (deviceObj.servername) type = "server";
        else if (deviceObj.hostname && deviceObj.is_pc_details) type = "pcdetails";
        else if (deviceObj.hostname && deviceObj.is_db_details) type = "DBDetails";
        else type = "camera";

        document.getElementById("device-type").value = type;

        showDeviceModal("edit", deviceObj);

    } catch (err) {
        console.error("Error loading device:", err);
        alert("Error: Cannot load device details. " + err.message);
    }
}