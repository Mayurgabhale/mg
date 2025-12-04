function detectTypeFromDeviceObj(obj) {
    // Cameras
    if (obj.cameraname) return "camera";

    // Controllers
    if (obj.controllername) return "controller";

    // Archivers
    if (obj.archivername) return "archiver";

    // Servers
    if (obj.servername) return "server";

    // PC / DB details
    if (obj.hostname) {
        if (obj.is_pc_details) return "pcdetails";
        if (obj.is_db_details) return "DBDetails";
    }

    // fallback to camera if unknown
    return "camera";
}