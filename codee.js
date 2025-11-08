this is not good
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
