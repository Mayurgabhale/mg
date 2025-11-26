const ctrlStatus = (ctrl.controllerStatus || ctrl.status || "").toString().toLowerCase();




// Apply location OR city filter
if (cityFilterLower !== "all") {
    const ctrlCity = (ctrl.City || ctrl.city || "").toString().toLowerCase();
    const ctrlLocation = (ctrl.Location || ctrl.location || "").toString().toLowerCase();

    // Match either City OR Location
    if (ctrlCity !== cityFilterLower && ctrlLocation !== cityFilterLower) return;
}