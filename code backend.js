function showDeviceModal(mode = "add", deviceObj = null) {
    const modal = document.getElementById("device-modal");
    const title = document.getElementById("device-modal-title");
    const deleteBtn = document.getElementById("device-delete-btn");

    document.getElementById("device-form").reset();
    document.getElementById("door-reader-body").innerHTML = "";
    document.getElementById("device-old-ip").value = "";

    // ===================== ADD MODE =====================
    if (mode === "add") {
        title.textContent = "Add Device";
        deleteBtn.style.display = "none";
        document.getElementById("device-type").disabled = false;
        document.getElementById("device-type").value = "camera"; // default
    }

    // ===================== EDIT MODE =====================
    else {
        title.textContent = "Edit Device";
        deleteBtn.style.display = "inline-block";
        document.getElementById("device-type").disabled = true;

        // correct UI type
        document.getElementById("device-type").value = deviceObj._type_for_ui;

        const name =
            deviceObj.cameraname ||
            deviceObj.controllername ||
            deviceObj.archivername ||
            deviceObj.servername ||
            deviceObj.hostname ||
            "";

        document.getElementById("device-name").value = name;
        document.getElementById("device-ip").value = deviceObj.IP_address || deviceObj.ip_address || "";
        document.getElementById("device-location").value = deviceObj.Location || deviceObj.location || "";
        document.getElementById("device-city").value = deviceObj.City || deviceObj.city || "";
        document.getElementById("device-details").value = deviceObj.device_details || "";
        document.getElementById("device-hyperlink").value = deviceObj.hyperlink || "";
        document.getElementById("device-remark").value = deviceObj.remark || "";
        document.getElementById("device-person").value = deviceObj.person_name || "";
        document.getElementById("device-old-ip").value = deviceObj.IP_address || deviceObj.ip_address || "";

        // Doors for controllers
        if (deviceObj.Doors && Array.isArray(deviceObj.Doors)) {
            document.getElementById("device-type").value = "controller";
            updateFormFields();
            deviceObj.Doors.forEach(d => addDoorRow(d.door || d.Door, d.reader || ""));
        }
    }

    // ==========================================================
    //        ADDED BY / UPDATED BY  — FINAL WORKING CODE
    // ==========================================================

    if (mode === "add") {
        // Show Added By, hide Updated By
        document.getElementById("added-by-box").style.display = "block";
        document.getElementById("updated-by-box").style.display = "none";

        const added = document.getElementById("device-added-by");
        added.value = currentUserName || "";  // logged-in user
        added.readOnly = false;              // editable
    }

    if (mode === "edit") {
        // Show both
        document.getElementById("added-by-box").style.display = "block";
        document.getElementById("updated-by-box").style.display = "block";

        const added = document.getElementById("device-added-by");
        const updated = document.getElementById("device-updated-by");

        added.value = deviceObj.added_by || deviceObj.AddedBy || "";
        added.readOnly = true;   // read-only in edit

        updated.value = currentUserName || ""; // editable
        updated.readOnly = false;
    }

    // ==========================================================

    updateFormFields();
    modal.style.display = "flex";
}