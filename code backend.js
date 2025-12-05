
const added = document.getElementById("device-added-by");
const updated = document.getElementById("device-updated-by");

// Added By
added.value =
    deviceObj.added_by ??
    deviceObj.AddedBy ??
    deviceObj.addedBy ??
    deviceObj.addedby ??
    "Unknown";
added.readOnly = true;

// Updated By (show stored value first)
updated.value =
    deviceObj.updated_by ??
    deviceObj.UpdatedBy ??
    deviceObj.updatedBy ??
    deviceObj.updatedby ??
    "";

// Then set current user (who is updating now)
updated.readOnly = false;
updated.value = loggedInUserName;