
IN-PUN-2NDFLR-ISTAR PRO
10.199.13.10 • Pune 2nd Floor  for this right side, i want to add, total door, and door reader count 

Controller Details
🔒
IN-PUN-2NDFLR-ISTAR PRO
10.199.13.10 • Pune 2nd Floor

Doors & Readers
Online
🚪
APAC_IN_PUN_2NDFLR_IDF ROOM_10:05:86 Restricted Door
Reader: in:1
Online
🚪
APAC_IN_PUN_2NDFLR_UPS/ELEC ROOM Restricted Door_10:05:FE
Reader: in:1
Online
🚪
APAC_IN_PUN_2NDFLR_RECPTION TO WORKSTATION DOOR_10:05:4B
Reader: in:1
Online
🚪
APAC_IN_PUN_2NDFLR_RECPTION TO WORKSTATION DOOR_10:05:4B
Reader: out:1
Online
🚪
APAC_IN_PUN_2NDFLR_LIFTLOBBY TO RECEPTION EMTRY DOOR_10:05:74
Reader: in:1
Online
🚪
APAC_IN_PUN_2NDFLR_LIFTLOBBY TO WORKSTATION DOOR_10:05:F0
Reader: N/A
Online


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
        closeBtn.addEventListener("mouseenter", function () {
            this.style.transform = "scale(1.1)";
        });
        closeBtn.addEventListener("mouseleave", function () {
            this.style.transform = "scale(1)";
        });
    }

    openDoorModal(html);
}
