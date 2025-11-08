function showDoorsReaders(controller) {
  if (!controller) return;

  let html = `
    <h2 style="margin-top:0;">${controller.controllername}</h2>
    <p><strong>IP:</strong> ${controller.IP_address || "N/A"}</p>
    <p><strong>City:</strong> ${controller.City || "Unknown"}</p>
    <p><strong>Status:</strong>
      <span style="color:${controller.controllerStatus === "Online" ? "green" : "red"};">
        ${controller.controllerStatus}
      </span>
    </p>
    <hr style="margin:10px 0;">
    <h3>Doors & Readers</h3>
  `;

  if (!controller.Doors || controller.Doors.length === 0) {
    html += `<p>No doors found for this controller.</p>`;
  } else {
    controller.Doors.forEach(door => {
      html += `
        <div style="
          border:1px solid #ccc;
          border-radius:8px;
          padding:8px;
          margin-bottom:8px;
          background:#f9f9f9;
        ">
          <p><strong>Door:</strong> ${door.Door}</p>
          <p><strong>Reader:</strong> ${door.Reader || "N/A"}</p>
          <p><strong>Status:</strong>
            <span style="color:${door.status === "Online" ? "green" : "red"};">
              ${door.status}
            </span>
          </p>
        </div>
      `;
    });
  }

  // ✅ Open the popup with controller door data
  openDoorModal(html);
}