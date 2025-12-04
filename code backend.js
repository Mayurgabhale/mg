index.html:1 Uncaught ReferenceError: openEditForDeviceFromIP is not defined
    at HTMLButtonElement.onclick (index.html:1:1)

index.html:1 Uncaught ReferenceError: openEditForDeviceFromIP is not defined
    at HTMLButtonElement.onclick (index.html:1:1)

card.insertAdjacentHTML("beforeend", `
                        <button class="edit-device-btn" onclick="openEditForDeviceFromIP('${deviceIP}')"
  style="margin-left:8px; padding:6px 8px;">Edit</button>
  <h3 class="device-name" style="font-size:20px; font-weight:500; font-family: PP Right Grotesk; margin-bottom: 10px;">
      ${device.cameraname || device.controllername || device.archivername || device.servername || device.hostname || "Unknown Device"}
  </h3>

  <div class="card-content">
      <p class="device-type-label ${deviceType}" 
         style="font-size:17px;  fon



         
      <button onclick="showDeviceModal()"
        style="padding: 8px 14px; background:#00adb5; color:white; border:none; border-radius:6px;">
        + Add Device
      </button>
