function detectTypeFromDeviceObj(obj) {
    // Cameras
    if (obj.cameraname) return "camera";

    // Controllers
    if (obj.controllername) return "controller";

    // Archivers
    if (obj.archivername) return "archiver";

    // Servers
    if (obj.servername) return "server";

    // DB machines always have DatabaseName OR DBDetails field
    if (obj.databasename || obj.DBname || obj.db_name) return "DBDetails";

    // PC machines have hostname but NOT database fields
    if (obj.hostname || obj.HostName) return "pcdetails";

    return "camera"; // fallback
}