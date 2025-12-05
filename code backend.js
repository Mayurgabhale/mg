function updateFormFields() {
    const type = document.getElementById("device-type").value;

    const nameField = document.getElementById("device-name").parentElement;
    const cameraFields = document.getElementById("camera-fields");
    const pcFields = document.getElementById("pc-fields");
    const doorSec = document.getElementById("door-reader-container");

    // RESET ALL
    nameField.style.display = "block";
    cameraFields.style.display = "none";
    pcFields.style.display = "none";
    doorSec.style.display = "none";

    // CAMERA
    if (type === "camera") {
        cameraFields.style.display = "block";
    }

    // CONTROLLER
    if (type === "controller") {
        doorSec.style.display = "block";
    }

    // PC DETAILS
    if (type === "pcdetails") {
        nameField.style.display = "none";      // hide Name*
        pcFields.style.display = "block";      // show Host Name + PC Name
        cameraFields.style.display = "none";   // hide camera fields
    }

    // DB DETAILS (same as PC, but no PC name)
    if (type === "dbdetails") {
        nameField.style.display = "none";
        pcFields.style.display = "none";
        cameraFields.style.display = "none";
    }
}