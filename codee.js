<!-- Enhanced Door Popup Modal -->
<div id="door-modal" style="  
  display:none;  
  position:fixed;  
  top:0; left:0;  
  width:100%; height:100%;  
  background:rgba(0,0,0,0.7);  
  backdrop-filter: blur(5px);
  z-index:1000;  
  justify-content:center;  
  align-items:center;  
  animation:fadeIn 0.3s ease;
">
<div style="  
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius:16px;  
  width:90%;
  max-width:650px;
  max-height:85%;  
  overflow-y:auto;  
  padding:0;
  box-shadow:0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1);
  position:relative;  
  border:1px solid rgba(255,255,255,0.2);
  font-family: 'Segoe UI', system-ui, sans-serif;
">
  <div style="
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding:20px 25px;
    border-radius:16px 16px 0 0;
    color:white;
    position:sticky;
    top:0;
    z-index:10;
  ">
    <span id="close-door-modal" style="  
      position:absolute;  
      top:20px; right:25px;  
      cursor:pointer;  
      font-size:28px;  
      font-weight:300;  
      transition:transform 0.2s;
      width:32px;
      height:32px;
      display:flex;
      align-items:center;
      justify-content:center;
      border-radius:50%;
      background:rgba(255,255,255,0.2);
    ">×</span>
    <h2 style="margin:0; font-size:1.5rem; font-weight:600;">Controller Details</h2>
  </div>
  <div id="door-modal-content" style="padding:25px;"></div>
</div>
</div>

<style>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.device-card {
  background: white;
  border-radius:12px;
  padding:20px;
  margin-bottom:15px;
  cursor:pointer;
  border:1px solid #e2e8f0;
  box-shadow:0 2px 10px rgba(0,0,0,0.04);
  transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation:slideUp 0.4s ease;
}

.device-card:hover {
  transform:translateY(-3px);
  box-shadow:0 8px 25px rgba(0,0,0,0.1);
  border-color:#667eea;
}

.status-badge {
  display:inline-flex;
  align-items:center;
  padding:4px 12px;
  border-radius:20px;
  font-size:0.85rem;
  font-weight:500;
  gap:6px;
}

.status-badge::before {
  content:'';
  width:8px;
  height:8px;
  border-radius:50%;
  display:inline-block;
}

.status-online {
  background:#f0f9ff;
  color:#0369a1;
  border:1px solid #bae6fd;
}

.status-online::before {
  background:#0ea5e9;
}

.status-offline {
  background:#fef2f2;
  color:#dc2626;
  border:1px solid #fecaca;
}

.status-offline::before {
  background:#ef4444;
}

.door-item {
  background:white;
  border:1px solid #e2e8f0;
  border-radius:12px;
  padding:18px;
  margin-bottom:12px;
  transition:all 0.2s ease;
  box-shadow:0 2px 8px rgba(0,0,0,0.03);
}

.door-item:hover {
  border-color:#c7d2fe;
  box-shadow:0 4px 12px rgba(0,0,0,0.08);
}

.loading-spinner {
  display:inline-block;
  width:20px;
  height:20px;
  border:2px solid #f3f3f3;
  border-top:2px solid #667eea;
  border-radius:50%;
  animation:spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>




...



function loadControllersInDetails() {
  const detailsContainer = document.getElementById("device-details");
  const extraContainer = document.getElementById("details-container");

  detailsContainer.innerHTML = `
    <div style="text-align:center; padding:40px 20px;">
      <div class="loading-spinner" style="margin:0 auto 15px;"></div>
      <p style="color:#64748b; font-size:16px;">Loading controllers...</p>
    </div>
  `;  
  extraContainer.innerHTML = "";  

  fetch("http://localhost/api/controllers/status")  
    .then(res => res.json())  
    .then(data => {  
      detailsContainer.innerHTML = "";  
      if (!Array.isArray(data) || data.length === 0) {  
        detailsContainer.innerHTML = `
          <div style="text-align:center; padding:40px 20px;">
            <div style="font-size:48px; margin-bottom:15px;">🔍</div>
            <h3 style="color:#475569; margin-bottom:8px;">No Controllers Found</h3>
            <p style="color:#64748b;">There are no controllers available at the moment.</p>
          </div>
        `;  
        return;  
      }  

      data.forEach(ctrl => {  
        const card = document.createElement("div");  
        card.className = "device-card";  

        const statusClass = ctrl.controllerStatus === "Online" ? "status-online" : "status-offline";
        
        card.innerHTML = `  
          <div style="display:flex; justify-content:between; align-items:flex-start; margin-bottom:12px;">
            <h3 style="font-size:20px; font-weight:600; margin:0; color:#1e293b; flex:1;">
              ${ctrl.controllername || "Unknown Controller"}  
            </h3>
            <span class="status-badge ${statusClass}">
              ${ctrl.controllerStatus}
            </span>
          </div>  
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:15px;">
            <div style="display:flex; align-items:center; gap:8px; color:#475569;">
              <span style="font-size:18px;">🌐</span>
              <div>
                <div style="font-size:12px; color:#64748b;">IP Address</div>
                <div style="font-weight:500;">${ctrl.IP_address || "N/A"}</div>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:8px; color:#475569;">
              <span style="font-size:18px;">🏙️</span>
              <div>
                <div style="font-size:12px; color:#64748b;">City</div>
                <div style="font-weight:500;">${ctrl.City || "Unknown"}</div>
              </div>
            </div>
          </div>
        `;  

        card.addEventListener("click", () => showDoorsReaders(ctrl));  
        detailsContainer.appendChild(card);  
      });  
    })  
    .catch(err => {  
      console.error("Error loading controllers:", err);  
      detailsContainer.innerHTML = `
        <div style="text-align:center; padding:40px 20px;">
          <div style="font-size:48px; margin-bottom:15px;">❌</div>
          <h3 style="color:#dc2626; margin-bottom:8px;">Failed to Load</h3>
          <p style="color:#64748b;">Unable to load controllers. Please try again.</p>
        </div>
      `;  
    });
}

function showDoorsReaders(controller) {
  if (!controller) return;

  let html = `
    <div style="margin-bottom:25px;">
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:15px;">
        <div style="
          width:50px;
          height:50px;
          border-radius:12px;
          background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
          font-size:20px;
        ">🔒</div>
        <div>
          <h3 style="margin:0 0 4px 0; color:#1e293b; font-size:1.3rem;">${controller.controllername}</h3>
          <p style="margin:0; color:#64748b; font-size:14px;">${controller.IP_address || "N/A"} • ${controller.City || "Unknown"}</p>
        </div>
      </div>
    </div>
    
    <div style="margin:25px 0 15px 0; display:flex; align-items:center; justify-content:space-between;">
      <h4 style="margin:0; color:#374151; font-size:1.1rem;">Doors & Readers</h4>
      <span class="status-badge ${controller.controllerStatus === "Online" ? "status-online" : "status-offline"}">
        ${controller.controllerStatus}
      </span>
    </div>
  `;

  if (!controller.Doors || controller.Doors.length === 0) {
    html += `
      <div style="text-align:center; padding:40px 20px; background:#f8fafc; border-radius:12px;">
        <div style="font-size:48px; margin-bottom:15px;">🚪</div>
        <h4 style="color:#475569; margin-bottom:8px;">No Doors Found</h4>
        <p style="color:#64748b; margin:0;">This controller doesn't have any doors configured.</p>
      </div>
    `;
  } else {
    html += `<div style="display:flex; flex-direction:column; gap:12px;">`;
    
    controller.Doors.forEach((door, index) => {
      const doorStatusClass = door.status === "Online" ? "status-online" : "status-offline";
      
      html += `
        <div class="door-item" style="animation-delay: ${index * 0.1}s;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <div style="
                width:36px;
                height:36px;
                border-radius:8px;
                background:#f1f5f9;
                display:flex;
                align-items:center;
                justify-content:center;
                color:#475569;
                font-size:16px;
              ">🚪</div>
              <div>
                <div style="font-weight:600; color:#1e293b;">${door.Door}</div>
                <div style="font-size:13px; color:#64748b;">Reader: ${door.Reader || "N/A"}</div>
              </div>
            </div>
            <span class="status-badge ${doorStatusClass}" style="font-size:0.8rem;">
              ${door.status}
            </span>
          </div>
        </div>
      `;
    });
    
    html += `</div>`;
  }

  // Add modal close button interaction
  const closeBtn = document.getElementById("close-door-modal");
  if (closeBtn) {
    closeBtn.addEventListener("mouseenter", function() {
      this.style.transform = "scale(1.1)";
    });
    closeBtn.addEventListener("mouseleave", function() {
      this.style.transform = "scale(1)";
    });
  }

  openDoorModal(html);
}






...
function loadControllersInDetails() {
  const detailsContainer = document.getElementById("device-details");
  const extraContainer = document.getElementById("details-container");

  detailsContainer.innerHTML = `
    <div style="text-align:center; padding:40px 20px;">
      <div class="loading-spinner" style="margin:0 auto 15px;"></div>
      <p style="color:#64748b; font-size:16px;">Loading controllers...</p>
    </div>
  `;  
  extraContainer.innerHTML = "";  

  fetch("http://localhost/api/controllers/status")  
    .then(res => res.json())  
    .then(data => {  
      detailsContainer.innerHTML = "";  
      if (!Array.isArray(data) || data.length === 0) {  
        detailsContainer.innerHTML = `
          <div style="text-align:center; padding:40px 20px;">
            <div style="font-size:48px; margin-bottom:15px;">🔍</div>
            <h3 style="color:#475569; margin-bottom:8px;">No Controllers Found</h3>
            <p style="color:#64748b;">There are no controllers available at the moment.</p>
          </div>
        `;  
        return;  
      }  

      data.forEach(ctrl => {  
        const card = document.createElement("div");  
        card.className = "device-card";  

        const statusClass = ctrl.controllerStatus === "Online" ? "status-online" : "status-offline";
        
        card.innerHTML = `  
          <div style="display:flex; justify-content:between; align-items:flex-start; margin-bottom:12px;">
            <h3 style="font-size:20px; font-weight:600; margin:0; color:#1e293b; flex:1;">
              ${ctrl.controllername || "Unknown Controller"}  
            </h3>
            <span class="status-badge ${statusClass}">
              ${ctrl.controllerStatus}
            </span>
          </div>  
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:15px;">
            <div style="display:flex; align-items:center; gap:8px; color:#475569;">
              <span style="font-size:18px;">🌐</span>
              <div>
                <div style="font-size:12px; color:#64748b;">IP Address</div>
                <div style="font-weight:500;">${ctrl.IP_address || "N/A"}</div>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:8px; color:#475569;">
              <span style="font-size:18px;">🏙️</span>
              <div>
                <div style="font-size:12px; color:#64748b;">City</div>
                <div style="font-weight:500;">${ctrl.City || "Unknown"}</div>
              </div>
            </div>
          </div>
        `;  

        card.addEventListener("click", () => showDoorsReaders(ctrl));  
        detailsContainer.appendChild(card);  
      });  
    })  
    .catch(err => {  
      console.error("Error loading controllers:", err);  
      detailsContainer.innerHTML = `
        <div style="text-align:center; padding:40px 20px;">
          <div style="font-size:48px; margin-bottom:15px;">❌</div>
          <h3 style="color:#dc2626; margin-bottom:8px;">Failed to Load</h3>
          <p style="color:#64748b;">Unable to load controllers. Please try again.</p>
        </div>
      `;  
    });
}

function showDoorsReaders(controller) {
  if (!controller) return;

  let html = `
    <div style="margin-bottom:25px;">
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:15px;">
        <div style="
          width:50px;
          height:50px;
          border-radius:12px;
          background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
          font-size:20px;
        ">🔒</div>
        <div>
          <h3 style="margin:0 0 4px 0; color:#1e293b; font-size:1.3rem;">${controller.controllername}</h3>
          <p style="margin:0; color:#64748b; font-size:14px;">${controller.IP_address || "N/A"} • ${controller.City || "Unknown"}</p>
        </div>
      </div>
    </div>
    
    <div style="margin:25px 0 15px 0; display:flex; align-items:center; justify-content:space-between;">
      <h4 style="margin:0; color:#374151; font-size:1.1rem;">Doors & Readers</h4>
      <span class="status-badge ${controller.controllerStatus === "Online" ? "status-online" : "status-offline"}">
        ${controller.controllerStatus}
      </span>
    </div>
  `;

  if (!controller.Doors || controller.Doors.length === 0) {
    html += `
      <div style="text-align:center; padding:40px 20px; background:#f8fafc; border-radius:12px;">
        <div style="font-size:48px; margin-bottom:15px;">🚪</div>
        <h4 style="color:#475569; margin-bottom:8px;">No Doors Found</h4>
        <p style="color:#64748b; margin:0;">This controller doesn't have any doors configured.</p>
      </div>
    `;
  } else {
    html += `<div style="display:flex; flex-direction:column; gap:12px;">`;
    
    controller.Doors.forEach((door, index) => {
      const doorStatusClass = door.status === "Online" ? "status-online" : "status-offline";
      
      html += `
        <div class="door-item" style="animation-delay: ${index * 0.1}s;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <div style="
                width:36px;
                height:36px;
                border-radius:8px;
                background:#f1f5f9;
                display:flex;
                align-items:center;
                justify-content:center;
                color:#475569;
                font-size:16px;
              ">🚪</div>
              <div>
                <div style="font-weight:600; color:#1e293b;">${door.Door}</div>
                <div style="font-size:13px; color:#64748b;">Reader: ${door.Reader || "N/A"}</div>
              </div>
            </div>
            <span class="status-badge ${doorStatusClass}" style="font-size:0.8rem;">
              ${door.status}
            </span>
          </div>
        </div>
      `;
    });
    
    html += `</div>`;
  }

  // Add modal close button interaction
  const closeBtn = document.getElementById("close-door-modal");
  if (closeBtn) {
    closeBtn.addEventListener("mouseenter", function() {
      this.style.transform = "scale(1.1)";
    });
    closeBtn.addEventListener("mouseleave", function() {
      this.style.transform = "scale(1)";
    });
  }

  openDoorModal(html);
}




