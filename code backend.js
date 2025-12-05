// ================= ADD / EDIT for ADDED BY & UPDATED BY =================
if (mode === "add") {
    // Show Added By, hide Updated By
    document.getElementById("added-by-box").style.display = "block";
    document.getElementById("updated-by-box").style.display = "none";

    const added = document.getElementById("device-added-by");
    added.value = currentUserName || "";   // logged-in user
    added.readOnly = false;                // editable in ADD mode
}

if (mode === "edit") {
    // Show both
    document.getElementById("added-by-box").style.display = "block";
    document.getElementById("updated-by-box").style.display = "block";

    const added = document.getElementById("device-added-by");
    const updated = document.getElementById("device-updated-by");

    // Read-only filled from existing record
    added.value = deviceObj.added_by || deviceObj.AddedBy || "";
    added.readOnly = true;

    // Editable filled with current user
    updated.value = currentUserName || "";
    updated.readOnly = false;
}