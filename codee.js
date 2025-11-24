function deviceTypeLabel(v) {
    const labels = {
        0: "Camera",
        1: "Archiver",
        2: "Controller",
        3: "CCURE"
    };
    return labels[v] || "";
}