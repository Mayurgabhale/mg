function validateRequiredFields() {
    let type = document.getElementById("device-type").value;

    // Base required fields
    let required = [
        { id: "device-name", label: "Device Name" },
        { id: "device-ip", label: "IP Address" },
        { id: "device-location", label: "Location" },
        { id: "device-city", label: "City" }
    ];

    // Add "added by" when ADD mode is active (box visible)
    if (document.getElementById("added-by-box").style.display !== "none") {
        required.push({ id: "device-added-by", label: "Added By" });
    }

    // Add "updated by" when UPDATE mode is active (box visible)
    if (document.getElementById("updated-by-box").style.display !== "none") {
        required.push({ id: "device-updated-by", label: "Updated By" });
    }

    // CAMERA fields
    if (type === "camera") {
        required.push({ id: "form-device-details", label: "Camera Details" });
    }

    // PC DETAILS replaces all except name/ip/location/city
    if (type === "pcdetails") {
        required = [
            { id: "Host-Name", label: "Host Name" },
            { id: "PC-Name", label: "PC Name" }
        ];

        // Add / Update boxes still required
        if (document.getElementById("added-by-box").style.display !== "none") {
            required.push({ id: "device-added-by", label: "Added By" });
        }
        if (document.getElementById("updated-by-box").style.display !== "none") {
            required.push({ id: "device-updated-by", label: "Updated By" });
        }
    }

    // DB DETAILS replaces all fields
    if (type === "dbdetails") {
        required = [
            { id: "db-hostname", label: "DB Host Name" },
            { id: "db-application", label: "DB Application" },
            { id: "db-windows-server", label: "Windows Server Version" }
        ];

        // Add / Update boxes still required
        if (document.getElementById("added-by-box").style.display !== "none") {
            required.push({ id: "device-added-by", label: "Added By" });
        }
        if (document.getElementById("updated-by-box").style.display !== "none") {
            required.push({ id: "device-updated-by", label: "Updated By" });
        }
    }

    // Validate each field
    for (let field of required) {
        let el = document.getElementById(field.id);

        // Check only if field is visible
        if (el && el.offsetParent !== null) {
            if (el.value.trim() === "") {
                el.style.border = "2px solid red";
                alert(`Please enter ${field.label}`);
                el.focus();
                return false;
            } else {
                el.style.border = "";
            }
        }
    }

    return true;
}