function updateFormFields() {
    const type = document.getElementById("device-type").value;

    const cameraFields = document.getElementById("camera-fields");
    const pcFields = document.getElementById("pc-fields");
    const dbFields = document.getElementById("db-fields");

    // Reset all required attributes
    document.querySelectorAll("#pc-fields input, #db-fields input, #camera-fields input")
        .forEach(input => input.removeAttribute("required"));

    // Hide all
    pcFields.style.display = "none";
    dbFields.style.display = "none";
    cameraFields.style.display = "none";

    // Apply visibility + required logic
    if (type === "camera") {
        cameraFields.style.display = "block";
        document.getElementById("device-details").setAttribute("required", "required");
    }

    if (type === "pcdetails") {
        pcFields.style.display = "block";
        document.getElementById("Host-Name").setAttribute("required", "required");
        document.getElementById("PC-Name").setAttribute("required", "required");
    }

    if (type === "dbdetails") {
        dbFields.style.display = "block";
        document.getElementById("db-hostname").setAttribute("required", "required");
        document.getElementById("db-application").setAttribute("required", "required");
        document.getElementById("db-windows-server").setAttribute("required", "required");
    }
}