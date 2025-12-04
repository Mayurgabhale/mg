function buildDeviceBody(type) {
    const common = {
        ip_address: document.getElementById("device-ip").value || null,
        location: document.getElementById("device-location").value || null,
        city: document.getElementById("device-city").value || null,
        remark: document.getElementById("device-remark").value || null,
        hyperlink: document.getElementById("device-hyperlink").value || null,
        details: document.getElementById("device-details").value || null,
        person_name: document.getElementById("device-person").value || null
    };

    switch (type) {
        case "cameras":
            return {
                cameraname: document.getElementById("device-name").value || null,
                device_details: common.details,
                hyperlink: common.hyperlink,
                remark: common.remark,
                ip_address: common.ip_address,
                location: common.location,
                city: common.city
            };

        case "controllers":
            return {
                controllername: document.getElementById("device-name").value || null,
                ip_address: common.ip_address,
                location: common.location,
                city: common.city
            };

        case "servers":
            return {
                servername: document.getElementById("device-name").value || null,
                ip_address: common.ip_address,
                location: common.location,
                city: common.city
            };

        case "archivers":
            return {
                archivername: document.getElementById("device-name").value || null,
                ip_address: common.ip_address,
                location: common.location,
                city: common.city
            };

        case "pcDetails":
            return {
                hostname: document.getElementById("device-name").value || null,
                ip_address: common.ip_address,
                location: common.location,
                city: common.city,
                pc_name: document.getElementById("device-person").value || null
            };

        case "DBDetails":
            return {
                hostname: document.getElementById("device-name").value || null,
                ip_address: common.ip_address,
                location: common.location,
                city: common.city,
                application: document.getElementById("device-details").value || null,
                windows_server: null
            };

        default:
            return {};
    }
}