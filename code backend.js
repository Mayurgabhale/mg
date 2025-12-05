function showDeviceModal(mode = "add", deviceObj = null) {
    const modal = document.getElementById("device-modal");
    const title = document.getElementById("device-modal-title");
    const deleteBtn = document.getElementById("device-delete-btn");

    document.getElementById("device-form").reset();
    document.getElementById("door-reader-body").innerHTML = "";
    document.getElementById("device-old-ip").value = "";

    if (mode === "add") {
        title.textContent = "Add Device";
        deleteBtn.style.display = "none";
        document.getElementById("device-type").disabled = false;
        document.getElementById("device-type").value = "camera"; // default

        // Added By
        document.getElementById("added-by-box").style.display = "block";
        document.getElementById("updated-by-box").style.display = "none";
        const added = document.getElementById("device-added-by");
        added.value = currentUserName || "";
        added.readOnly = false;

    } else {
        title.textContent = "Edit Device";
        deleteBtn.style.display = "inline-block";
        document.getElementById("device-type").disabled = true;

        document.getElementById("device-type").value = deviceObj._type_for_ui;

        const name = deviceObj.cameraname || deviceObj.controllername || deviceObj.archivername || deviceObj.servername || deviceObj.hostname || "";
        document.getElementById("device-name").value = name;
        document.getElementById("device-ip").value = deviceObj.IP_address || deviceObj.ip_address || "";
        document.getElementById("device-location").value = deviceObj.Location || deviceObj.location || "";
        document.getElementById("device-city").value = deviceObj.City || deviceObj.city || "";
        document.getElementById("device-details").value = deviceObj.device_details || "";
        document.getElementById("device-hyperlink").value = deviceObj.hyperlink || "";
        document.getElementById("device-remark").value = deviceObj.remark || "";
        document.getElementById("device-old-ip").value = deviceObj.IP_address || deviceObj.ip_address || "";

        // Controller Doors
        if (deviceObj.Doors && Array.isArray(deviceObj.Doors)) {
            document.getElementById("device-type").value = "controller";
            updateFormFields();
            deviceObj.Doors.forEach(d => addDoorRow(d.door || d.Door, d.reader || ""));
        }

        // Added By / Updated By
        document.getElementById("added-by-box").style.display = "block";
        document.getElementById("updated-by-box").style.display = "block";
        const added = document.getElementById("device-added-by");
        const updated = document.getElementById("device-updated-by");

        added.value = deviceObj.added_by || deviceObj.AddedBy || "";
        added.readOnly = true;

        updated.value = currentUserName || "";
        updated.readOnly = false;
    }

    updateFormFields();
    modal.style.display = "flex";
}