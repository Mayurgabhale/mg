<!-- 🌟 Door Popup Modal (Modern Style) -->
<div id="door-modal" class="door-modal">
  <div class="door-modal-content">
    <span id="close-door-modal" class="door-modal-close">&times;</span>
    <div id="door-modal-content"></div>
  </div>
</div>




/* 🌟 Overlay */
.door-modal {
  display: none;
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease;
}

/* 🌟 Modal Box */
.door-modal-content {
  background: #ffffff;
  border-radius: 16px;
  width: 650px;
  max-height: 80%;
  overflow-y: auto;
  padding: 25px 30px;
  position: relative;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.4s ease;
  border-top: 5px solid #007bff;
  font-family: "Segoe UI", sans-serif;
}

/* ✖ Close Button */
.door-modal-close {
  position: absolute;
  top: 12px;
  right: 20px;
  cursor: pointer;
  font-size: 26px;
  font-weight: bold;
  color: #555;
  transition: 0.3s;
}

.door-modal-close:hover {
  color: #ff4444;
  transform: rotate(90deg);
}

/* 🌟 Header Text */
#door-modal-content h2 {
  font-size: 22px;
  color: #007bff;
  margin-bottom: 4px;
}

#door-modal-content h3 {
  margin-top: 20px;
  color: #333;
  font-size: 18px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 4px;
}

/* 🧩 Door + Reader Cards */
.door-item {
  background: #f8faff;
  border: 1px solid #d0e3ff;
  border-radius: 10px;
  padding: 12px 15px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

.door-item:hover {
  background: #e9f2ff;
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

/* ✅ Status Badge */
.status-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.status-online {
  background: #28a745;
}

.status-offline {
  background: #dc3545;
}

/* ✨ Animations */
@keyframes fadeIn {
  from {opacity: 0;}
  to {opacity: 1;}
}

@keyframes slideUp {
  from {transform: translateY(30px); opacity: 0;}
  to {transform: translateY(0); opacity: 1;}
}








function showDoorsReaders(controller) {
  if (!controller) return;

  let html = `
    <h2>${controller.controllername}</h2>
    <p><strong>IP:</strong> ${controller.IP_address || "N/A"}</p>
    <p><strong>City:</strong> ${controller.City || "Unknown"}</p>
    <p><strong>Status:</strong>
      <span class="status-badge ${controller.controllerStatus === "Online" ? "status-online" : "status-offline"}">
        ${controller.controllerStatus}
      </span>
    </p>
    <h3>Doors & Readers</h3>
  `;

  if (!controller.Doors || controller.Doors.length === 0) {
    html += `<p>No doors found for this controller.</p>`;
  } else {
    controller.Doors.forEach(door => {
      html += `
        <div class="door-item">
          <p><strong>Door:</strong> ${door.Door}</p>
          <p><strong>Reader:</strong> ${door.Reader || "N/A"}</p>
          <p><strong>Status:</strong>
            <span class="status-badge ${door.status === "Online" ? "status-online" : "status-offline"}">
              ${door.status}
            </span>
          </p>
        </div>
      `;
    });
  }

  // ✅ Open modal
  openDoorModal(html);
}






....
function openDoorModal(html) {
  const modal = document.getElementById("door-modal");
  const modalContent = document.getElementById("door-modal-content");
  modalContent.innerHTML = html;
  modal.style.display = "flex";
}

document.getElementById("close-door-modal").addEventListener("click", () => {
  document.getElementById("door-modal").style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target.id === "door-modal") {
    document.getElementById("door-modal").style.display = "none";
  }
});

