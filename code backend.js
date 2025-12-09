// === DB DETAILS FIXED ===
document.getElementById("db-hostname").value =
    deviceObj.db_hostname ||
    deviceObj.DB_HostName ||
    deviceObj.DB_Hostname ||
    deviceObj.db_host_name ||
    deviceObj.hostname ||           // <-- used by some DB cards
    deviceObj.HostName ||
    "";

document.getElementById("db-application").value =
    deviceObj.application ||
    deviceObj.Application ||        // <-- used by some DB cards
    deviceObj.app ||
    deviceObj.App ||
    deviceObj.DB_Application ||
    "";

document.getElementById("db-windows-server").value =
    deviceObj.windows_server ||
    deviceObj.WindowsServer ||      // <-- used by some DB cards
    deviceObj.Windows_Server ||
    deviceObj.DB_WindowsServer ||
    deviceObj.DB_Windows_Server ||
    "";