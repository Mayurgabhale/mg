} else if (mode === "edit" && deviceObj) {
    title.textContent = "Edit Device";
    deleteBtn.style.display = "inline-block";
    document.getElementById("device-type").disabled = true;

    document.getElementById("device-type").value = deviceObj._type_for_ui || "camera";

    document.getElementById("device-name").value =
        deviceObj.cameraname || deviceObj.controllername || deviceObj.archivername || deviceObj.servername || deviceObj.hostname || "";
    document.getElementById("device-ip").value = deviceObj.IP_address || deviceObj.ip_address || "";
    document.getElementById("device-location").value = deviceObj.Location || deviceObj.location || "";
    document.getElementById("device-city").value = deviceObj.City || deviceObj.city || "";
    document.getElementById("device-details").value = deviceObj.device_details || "";
    document.getElementById("device-hyperlink").value = deviceObj.hyperlink || "";
    document.getElementById("device-remark").value = deviceObj.remark || "";
    document.getElementById("device-old-ip").value = deviceObj.IP_address || deviceObj.ip_address || "";

    // PC fields
    document.getElementById("Host-Name").value = deviceObj.hostname || "";
    document.getElementById("PC-Name").value = deviceObj.pc_name || "";

    // ✅ DB Details fields (handles all casing variations)
    document.getElementById("db-hostname").value =
        deviceObj.db_hostname ??
        deviceObj.hostname ??
        deviceObj.HostName ??
        deviceObj.host_name ??
        "";

    document.getElementById("db-application").value =
        deviceObj.application ??
        deviceObj.Application ??
        deviceObj.app ??
        deviceObj.App ??
        "";

    document.getElementById("db-windows-server").value =
        deviceObj.windows_server ??
        deviceObj.Windows_Server ??
        deviceObj.windowsServer ??
        deviceObj.WindowsServer ??
        "";

    // ... (rest remains same)
}