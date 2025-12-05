<!-- CAMERA FIELDS ONLY -->
<div id="camera-fields">
    <label>Details*</label>
    <input id="device-details" type="text" placeholder="e.g FLIR, Verkada">

    <label>Hyperlink</label>
    <input id="device-hyperlink" type="url" placeholder="e.g https://link">

    <label>Remark</label>
    <input id="device-remark" type="text" placeholder="e.g Not accessible">
</div>


.
function updateFormFields() {
    const type = document.getElementById("device-type").value;

    // Door section for controller
    const doorSec = document.getElementById("door-reader-container");
    doorSec.style.display = (type === "controller") ? "block" : "none";

    // CAMERA ONLY FIELDS
    const cameraFields = document.getElementById("camera-fields");
    cameraFields.style.display = (type === "camera") ? "block" : "none";
}
