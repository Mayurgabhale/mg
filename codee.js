C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\script.js

this card this i want in ligh and dark theme ok 
read the below all code carefully, and give me this card dark and light css . ok
only card ok, other alread is wokr only thsi card ok 
WKSWUPUN2709
 GSOC Laptop

 WKSWUPUN2709

 APAC

 Pune Podium

Offline

WKSPUN-902213
 Abhishek Laptop

 WKSPUN-902213

 APAC

 Pune Podium

Offline

Archiver Manila
 ARCHIVERS

 10.193.132.8

 APAC

 Taguig City

Online

Archiver Taguig City Philippines
 ARCHIVERS

 10.194.2.190

 APAC

 Taguig City

Online

                    card.insertAdjacentHTML("beforeend", `
  <h3 class="device-name" style="font-size:20px; font-weight:500; font-family: PP Right Grotesk; margin-bottom: 10px;">
      ${device.cameraname || device.controllername || device.archivername || device.servername || device.hostname || "Unknown Device"}
  </h3>

  <div class="card-content">
      <p class="device-type-label ${deviceType}" 
         style="font-size:17px;  font-family: Roboto; font-weight:100; margin-bottom: 10px; display:flex; justify-content:space-between; align-items:center;">
          
          <strong>
            <i class="${getDeviceIcon(deviceType)}" style="margin-right: 5px;"></i> 
            ${deviceLabel}
          </strong>
          
          ${deviceType.includes("camera")
                            ? `<button class="open-camera-btn"
        onclick="openCamera('${deviceIP}', '${(device.cameraname || device.controllername || "").replace(/'/g, "\\'")}', '${device.hyperlink || ""}')"
        title="Open Camera"
        style="border:none; cursor:pointer; font-weight:100; border-radius:50%; width:34px; height:34px; display:flex; justify-content:center; align-items:center;">
    <img src="images/cctv.png" alt="Logo" style="width:33px; height:33px;"/>
</button>`
                            : ""
                        }
      </p>

      <p style="font-size: ;  font-family: Roboto; margin-bottom: 8px;">
          <strong style="color:rgb(8, 8, 8);"><i class="fas fa-network-wired" style="margin-right: 6px;"></i></strong>
          <span 
              class="device-ip" 
              style="font-weight:100; color: #00adb5; cursor: pointer; text-shadow: 0 0 1px rgba(0, 173, 181, 0.3);  font-family: Roboto;"
              onclick="copyToClipboard('${deviceIP}')"
              title="Click to copy IP"
          >
              ${deviceIP}
          </span>
      </p>

      <p style="font-size: ;  font-family: Roboto; margin-bottom: 6px;">
          <strong style="color: rgb(13, 13, 13);"><i class="fas fa-map-marker-alt" style="margin-right: 5px;"></i></strong>
          <span style="font-size:; font-weight:100; color: rgb(8, 9, 9); margin-left: 12px;  font-family: Roboto; font-size: ;">${device.location || "N/A"}</span>
      </p>

      <p style="font-size:;  font-family: Roboto;>
          <strong style="color: rgb(215, 217, 222);"><i class="fas fa-city" style="margin-right: 5px;"></i></strong>
          <span style="font-weight:100; color: rgb(7, 7, 7); margin-left: 4px;  font-family: Roboto; font-size:;">${city}</span>
      </p>
  </div>
`);
                    card.appendChild(statusContainer);

                      // --- ADDED: if this is a controller card, attach click to open doors modal ---
                    if (deviceType.includes("controller")) {
                        card.style.cursor = "pointer";
                        card.title = "Click to view Doors for this controller";
                        card.setAttribute("role", "button");
                        card.setAttribute("tabindex", "0");

                        // click handler that uses cached controllers when possible
                        const openControllerDoors = async () => {
                            // try to find matching controller from cache
                            let ctrl = findControllerForDevice({ ip: deviceIP, controllername: device.controllername, city: city });
                            if (!ctrl) {
                                // ensure controllers are cached then try again
                                await ensureControllersCached();
                                ctrl = findControllerForDevice({ ip: deviceIP, controllername: device.controllername, city: city });
                            }
                            if (ctrl) {
                                showDoorsReaders(ctrl);
                            } else {
                                // fallback: open controllers list then highlight nearest by city/IP
                                loadControllersInDetails();
                                // show a quick toast/message to indicate we couldn't find exact match
                                console.warn("Controller details not found in cache for IP/name:", deviceIP, device.controllername);
                            }
                        };

                        card.addEventListener("click", (ev) => {
                            openControllerDoors();
                        });


------------
C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\newcss.css
                        /* Theme Variables */
:root {
  /* Dark Theme (Default) */
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-card: #1a1d29;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-accent: #7c3aed;
  --border-color: #334155;
  --shadow: rgba(0, 0, 0, 0.3);
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --chart-bg: #0a0a0a;
}

.theme-light {
  /* Light Theme */
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --bg-card: #ffffff;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-accent: #7c3aed;
  --border-color: #e2e8f0;
  --shadow: rgba(0, 0, 0, 0.1);
  --success: #059669;
  --warning: #d97706;
  --danger: #dc2626;
  --chart-bg: #f1f5f9;
}

/* Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.3s ease;
  min-height: 100vh;
}

/* Default = Dark Theme */
#region-title {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;

  background: var(--bg-secondary);
  /* Dark background */
  color: var(--text-primary);
  /* Text color */

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  padding: 24px;
  font-size: 35px;
  font-family: "PP Right Grotesk";
  font-weight: 600;

  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 4px 10px var(--shadow);
  transition: all 0.3s ease;
}


body.theme-light #region-title {
  background: var(--bg-secondary);
  /* Light background */
  color: var(--text-primary);
  /* Dark text */

  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 2px 6px var(--shadow);
}

body.theme-light #region-title span {
  color: var(--text-primary);
}

body.theme-light #region-title .region-logo a {
  color: var(--text-accent);
}




/* Tooltip container */
.tooltip .tooltiptext {
  visibility: hidden;
  opacity: 0;
  width: 140px;
  background: var(--bg-secondary);
  /* Dark background */
  color: var(--text-primary);
  /* Text color */
  text-align: center;
  padding: 6px;
  position: absolute;
  top: 150%;
  /* position above icon */
  left: 70%;
  transform: translateX(-50%);
  /* transition: opacity 0.3s; */
  z-index: 10001;
  font-size: 14px;
  font-style: normal;
  font-family: 'Times New Roman', Times, serif;
}

/* Show tooltip on hover */
.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}

/* Layout */
/* .container {
  display: flex;
  min-height: 100vh;
} */

/* Sidebar Styles */
.sidebar-toggle {
  position: fixed;
  top: 15px;
  left: 10px;
  z-index: 1001;
  background: var(--text-accent);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px var(--shadow);
  transition: all 0.3s ease;
}

.sidebar-toggle:hover {
  transform: scale(1.05);
}

#sidebar {
  position: fixed;
  top: 0;
  left: -320px;
  width: 300px;
  height: 100vh;
  background: var(--bg-card);
  color: var(--text-primary);
  padding: 20px;
  overflow-y: auto;
  transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 4px 0 20px var(--shadow);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

#sidebar.active {
  left: 0;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
}

.sidebar-overlay.active {
  opacity: 1;
  visibility: visible;
}

/* Main Content */
#content {
  margin-top: 35px;
  flex: 1;
  padding: 10px 5px;
  transition: margin-left 0.3s ease;
  margin-left: 0;
}

#sidebar.active~#content {
  margin-left: 300px;
}

/* Details Section */
.details-section {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px var(--shadow);
  border: 1px solid var(--border-color);
}

.details-header {
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.details-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-accent);
  display: flex;
  align-items: center;
  gap: 10px;
}

.details-header h2 i {
  font-size: 1.3rem;
}

#device-search {
  flex: 1;
  min-width: 250px;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-card);
  color: var(--text-primary);
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

#device-search:focus {
  outline: none;
  border-color: var(--text-accent);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

#device-search::placeholder {
  color: var(--text-secondary);
}

.device-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 16px;
}




/* Theme Toggle */
.theme-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1001;
  background: var(--text-accent);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px var(--shadow);
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  transform: scale(1.05);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .graphs-grid.dashboard-layout {
    grid-template-columns: 1fr;
  }

 
    C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\index.html
    
    <!-- Sidebar -->
    <aside id="sidebar">
      <div class="sidebar-header">
        <h2 class="sidebar-title"><i class="fas fa-sliders-h"></i> </h2>
        <div class="header-controls">
          <button class="theme-toggle" id="themeToggle">
            <i class="fas fa-moon"></i>
          </button>
        </div>
        <button class="close-sidebar" id="closeSidebar">
          <i class="fas fa-times"></i>
        </button>
      </div>

                        
    C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\styles.css
/* ===== Device Grid ===== */
.device-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
  padding: 20px;
}

/* ===== Device Card Styling ===== */
.device-card {

  background: #f0f8fc;

  border: 1px solid #e0e0e0;
  padding: 20px;
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  position: relative;
  color: #212529;

}

.device-card:hover {
  transform: translateY(-4px);
}

/* ===== Online/Offline Background ===== */
.device-card[data-status="online"] {
  border: 0.11px solid #10e63468;
  border-left: 5px solid #28a745;

}

.device-card[data-status="offline"] {
  border: 0.11px solid #f6051165;
  border-left: 7px solid #f60511de;

}

/* ===== Typography ===== */
.device-name {
  font-size: 18px;
  margin-bottom: 10px;
  color: #212529;
  border-bottom: 1px solid #e0e0e0;
}

.device-type-label {
  font-size: 18px;
  margin-bottom: 12px;

}

.device-ip {
  color: #00adb5;
  cursor: pointer;
  transition: color 0.2s ease;
}

.device-ip:hover {
  color: #00fff5;
  text-decoration: underline;
}

/* ===== Status Styling ===== */
.device-status {
  margin-top: 15px;
  font-size: 18px;
  display: flex;
  align-items: center;
  color: #ccc;
}

.online-dot {
  background-color: #10e634;
}

.offline-dot {
  background-color: #f50f1a;
}

.online-dot,
.offline-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}

/* ===== Icon Colors (by device type) ===== */



/* ===== Icon Default Styling ===== */
.device-type-label i,
.device-card i {
  margin-right: 6px;
  font-size: 18px;
}


/* Device type icons by type */
.device-type-label.cameras i {
  color: #1e88e5;
}

.device-type-label.controllers i {
  color: #8e24aa;
  /* Purple */
}

.device-type-label.archivers i {
  color: #fb8c00;
  /* Orange */
}

.device-type-label.servers i {
  color: #43a047;
  /* Green */
}


/* Specific icon styles inside <p> blocks */
.device-card p i.fa-network-wired {
  color: #007bff;
  /* Blue for IP */
}

.device-card p i.fa-map-marker-alt {
  color: #fbc531;
  /* Red for Location */
}

.device-card p i.fa-city {
  color: #9b59b6;
  /* Purple for City */
}





/* ===== Responsive Adjustments ===== */
@media screen and (max-width: 600px) {
  .details-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  #device-search {
    width: 100%;
  }
}

.summary .card.active {
  background-color: #cbe1fe;
  transition: background-color 0.3s ease, border 0.3s ease;
}

/* ///////// */
