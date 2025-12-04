function updateFormFields() {
    const type = document.getElementById("device-type").value;
    const doorSec = document.getElementById("door-reader-container");
    doorSec.style.display = (type === "controller") ? "block" : "none";
}

document.getElementById("device-type").addEventListener("change", updateFormFields);