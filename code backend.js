document.getElementById("db-fields").style.display = "none";


let body = {
    name: document.getElementById("device-name").value,
    ip_address: document.getElementById("device-ip").value,
    location: document.getElementById("device-location").value,
    city: document.getElementById("device-city").value,
    device_details: document.getElementById("device-details").value,
    hyperlink: document.getElementById("device-hyperlink").value,
    remark: document.getElementById("device-remark").value,
    hostname: document.getElementById("Host-Name").value,
    pc_name: document.getElementById("PC-Name").value,
    added_by: document.getElementById("device-added-by").value,
    updated_by: document.getElementById("device-updated-by").value,

    // ADD THESE FOR DB
    db_hostname: document.getElementById("db-hostname").value,
    application: document.getElementById("db-application").value,
    windows_server: document.getElementById("db-windows-server").value
};