function updateFormFields() {
    const type = document.getElementById("device-type").value;

    const nameField = document.getElementById("name-field");
    const cameraFields = document.getElementById("camera-fields");
    const pcFields = document.getElementById("pc-fields");
    const doorSec = document.getElementById("door-reader-container");

    // RESET ALL
    nameField.style.display = "block";
    cameraFields.style.display = "none";
    pcFields.style.display = "none";
    doorSec.style.display = "none";

    if (type === "camera") {
        cameraFields.style.display = "block";
    }

    if (type === "controller") {
        doorSec.style.display = "block";
    }

    if (type === "pcdetails") {
        nameField.style.display = "none";
        pcFields.style.display = "block";
    }

    if (type === "dbdetails") {
        nameField.style.display = "none";
    }
}