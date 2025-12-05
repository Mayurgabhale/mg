if (mode === "add") {
    document.getElementById("added-by-box").style.display = "block";
    document.getElementById("updated-by-box").style.display = "none";

    const added = document.getElementById("device-added-by");
    added.value = currentUserName;      // fill with logged-in user
    added.readOnly = false;             // editable in ADD mode
}


...
if (mode === "edit") {
    document.getElementById("added-by-box").style.display = "block";
    document.getElementById("updated-by-box").style.display = "block";

    const added = document.getElementById("device-added-by");
    const updated = document.getElementById("device-updated-by");

    added.value = deviceObj.added_by || "";
    added.readOnly = true;              // read-only in EDIT mode

    updated.value = currentUserName;    // editable
    updated.readOnly = false;
}