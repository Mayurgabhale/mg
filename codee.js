function showDoorsReaders(controller) {
  const extraContainer = document.getElementById("details-container");
  extraContainer.innerHTML = `
    <h3 style="margin-bottom:10px; font-weight:600;">
      ${controller.controllername} — Doors & Readers
    </h3>
  `;

  if (!controller.Doors || controller.Doors.length === 0) {
    extraContainer.innerHTML += "<p>No door data available for this controller.</p>";
    return;
  }

  controller.Doors.forEach(door => {
    const doorCard = document.createElement("div");
    doorCard.className = "device-card";
    doorCard.style.border = "1px solid #aaa";
    doorCard.style.padding = "8px";
    doorCard.style.marginBottom = "8px";
    doorCard.style.borderRadius = "8px";

    doorCard.innerHTML = `
      <p><strong>Door:</strong> ${door.Door}</p>
      <p><strong>Reader:</strong> ${door.Reader || "N/A"}</p>
      <p>Status:
        <span style="color:${door.status === "Online" ? "green" : "red"};">
          ${door.status}
        </span>
      </p>
    `;

    extraContainer.appendChild(doorCard);
  });
}