document.getElementById("device-form").addEventListener("submit", function (e) {
    e.preventDefault(); // stop form from submitting

    if (!validateRequiredFields()) {
        alert("Please fill all required fields.");
        return;
    }

    alert("Form submitted successfully!");
});

function validateRequiredFields() {
    let deviceType = document.getElementById("device-type").value;

    // Basic required fields
    let requiredFields = [
        "device-name",
        "device-ip",
        "device-location",
        "device-city"
    ];

    // CONDITIONAL FIELDS
    if (deviceType === "pcdetails") {
        requiredFields.push("Host-Name", "PC-Name");
    }

    if (deviceType === "dbdetails") {
        requiredFields.push("db-hostname", "db-application", "db-windows-server");
    }

    if (deviceType === "camera") {
        requiredFields.push("device-details");
    }

    // Loop through and validate
    for (let id of requiredFields) {
        let field = document.getElementById(id);
        if (field && field.offsetParent !== null) {  // visible fields only
            if (field.value.trim() === "") {
                field.style.border = "2px solid red";
                field.focus();
                return false;
            } else {
                field.style.border = ""; 
            }
        }
    }

    return true;
}