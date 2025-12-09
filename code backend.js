mapped.db_hostname = body.db_hostname;


document.getElementById("db-hostname").value =
    deviceObj.db_hostname ??
    deviceObj.DB_HostName ??
    deviceObj.DB_Hostname ??
    deviceObj.db_host_name ??
    deviceObj.hostname ??
    deviceObj.HostName ??
    "";

document.getElementById("db-application").value =
    deviceObj.application ??
    deviceObj.Application ??
    deviceObj.app ??
    deviceObj.App ??
    deviceObj.DB_Application ??
    "";

document.getElementById("db-windows-server").value =
    deviceObj.windows_server ??
    deviceObj.Windows_Server ??
    deviceObj.WindowsServer ??
    deviceObj.DB_WindowsServer ??
    deviceObj.DB_Windows_Server ??
    "";