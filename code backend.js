// === DB DETAILS – FULLY FIXED VERSION ===
document.getElementById("db-hostname").value =
    deviceObj.db_hostname ||
    deviceObj.DB_HostName ||
    deviceObj.DB_Hostname ||
    deviceObj.db_host_name ||
    deviceObj.hostname ||           // <-- second device stores hostname here
    deviceObj.HostName ||
    "";

document.getElementById("db-application").value =
    deviceObj.application ||
    deviceObj.Application ||        // <-- second device stores Application here
    deviceObj.app ||
    deviceObj.App ||
    deviceObj.DB_Application ||
    "";

document.getElementById("db-windows-server").value =
    deviceObj.windows_server ||
    deviceObj.WindowsServer ||      // <-- second device stores WindowsServer here
    deviceObj.Windows_Server ||
    deviceObj.DB_WindowsServer ||
    deviceObj.DB_Windows_Server ||
    "";