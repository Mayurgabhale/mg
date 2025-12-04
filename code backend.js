function exportDoorsToCsv(controller) {
    if (!controller) return;

    const filenameBase = (controller.controllername || "controller").replace(/[^\w\-]/g, "_");
    const filename = `${filenameBase}_doors.csv`;

    const rows = [];

    rows.push([`Controller: ${controller.controllername || ""}`]);
    rows.push([`IP: ${controller.IP_address || ""}`, `City: ${controller.City || ""}`]);

    const totalDoors = Array.isArray(controller.Doors) ? controller.Doors.length : 0;
    const totalReaders = Array.isArray(controller.Doors)
        ? controller.Doors.reduce((acc, d) => acc + (d.reader && d.reader.toString().trim() ? 1 : 0), 0)
        : 0;

    rows.push([`Total Doors: ${totalDoors}`, `Total Readers: ${totalReaders}`]);
    rows.push([]); 

    // Column headers
    rows.push(["Door", "Reader", "Status"]);

    // Door rows
    if (Array.isArray(controller.Doors)) {
        controller.Doors.forEach((d) => {
            rows.push([d.door || "", d.reader || "", d.status || ""]);
        });
    }

    const csvContent = rows.map(r => r.map(_escapeCsvValue).join(",")).join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}