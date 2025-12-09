function validateRequiredFields() {
    let type = document.getElementById("device-type").value;

    // Required fields for all modes
    let required = [
        { id: "device-name", label: "Device Name" },
        { id: "device-ip", label: "IP Address" },
        { id: "device-location", label: "Location" },
        { id: "device-city", label: "City" }
    ];

    // For CAMERA
    if (type === "camera") {
        required.push({ id: "form-device-details", label: "Camera Details" });
    }

    // For PC DETAILS
    if (type === "pcdetails") {
        required = [
            { id: "Host-Name", label: "Host Name" },
            { id: "PC-Name", label: "PC Name" }
        ];
    }

    // For DB DETAILS
    if (type === "dbdetails") {
        required = [
            { id: "db-hostname", label: "DB Host Name" },
            { id: "db-application", label: "DB Application" },
            { id: "db-windows-server", label: "Windows Server Version" }
        ];
    }

    // Loop through required fields
    for (let field of required) {
        let el = document.getElementById(field.id);

        if (el && el.offsetParent !== null) { // check visible only
            if (el.value.trim() === "") {
                el.style.border = "2px solid red";
                el.focus();
                alert(`Please enter ${field.label}`);
                return false;
            } else {
                el.style.border = "";
            }
        }
    }

    return true;  // all good
}