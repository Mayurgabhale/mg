document.getElementById("db-application").value = deviceObj.application;
document.getElementById("db-windows-server").value = deviceObj.windows_server;
document.getElementById("db-hostname").value = deviceObj.hostname || "";



...
// DB Details fields (handles all casing formats)
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