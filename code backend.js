if (mode === "add") {
    document.getElementById("added-by-box").style.display = "block";
    document.getElementById("updated-by-box").style.display = "none";

    const added = document.getElementById("device-added-by");
    added.value = currentUserName;      // fill with logged-in user
    added.readOnly = false;             // editable in ADD mode
}