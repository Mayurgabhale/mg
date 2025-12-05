function detectTypeFromDeviceObj(obj) {
    // Camera
    if (obj.cameraname) return "camera";

    // Controller
    if (obj.controllername) return "controller";

    // Archiver
    if (obj.archivername) return "archiver";

    // Server
    if (obj.servername) return "server";

    // --- DB DETECTION FIX ---
    // 1. Check explicit DB name fields
    if (obj.databasename || obj.DBname || obj.db_name) return "dbdetails";

    // 2. Check application contains "db" or "database"
    if (obj.application && obj.application.toLowerCase().includes("db")) {
        return "dbdetails";
    }

    // PC (has hostname but not DB fields)
    if (obj.hostname || obj.HostName) return "pcdetails";

    return "camera"; // fallback
}