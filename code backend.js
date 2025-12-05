function detectTypeFromDeviceObj(obj) {
    const app = (obj.application || "").toLowerCase();

    // FORCE DB + APP → DB DETAILS
    if (app.includes("db") || app.includes("app")) {
        return "dbdetails";
    }

    if (obj.cameraname) return "camera";
    if (obj.controllername) return "controller";
    if (obj.archivername) return "archiver";
    if (obj.servername) return "server";

    if (obj.hostname || obj.HostName) return "pcdetails";

    return "camera";
}