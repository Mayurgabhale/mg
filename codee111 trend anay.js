function buildControllerStatus() {
  fullStatus = controllerData.map(controller => {
    const ip = controller.IP_address.trim();
    const status = deviceStatus[ip] || "Unknown";

    // If controller offline, mark all doors offline too
    const doors = controller.Doors.map(d => ({
      ...d,
      status: status === "Online" ? "Online" : "Offline",
    }));

    return {
      controllername: controller.controllername,
      IP_address: ip,
      Location: controller.Location || "Unknown",
      City: controller.City || "Unknown",
      controllerStatus: status,
      Doors: doors,
    };
  });
}