if (deviceObj.application)
    document.getElementById("db-application").value = deviceObj.application;

if (deviceObj.windows_server)
    document.getElementById("db-windows-server").value = deviceObj.windows_server;

document.getElementById("db-hostname").value = deviceObj.hostname || "";