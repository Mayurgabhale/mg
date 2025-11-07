this is my css filese
  i give you only css,
    that through you understn how is the desing.
read this desint.
can you redesing this page. for more atractive UI wiht responive for eahc and every desint wiht different theme. 
    this is the Device Dashboardoption value="cameras">Cameras</option>
                <option value="archivers">Archivers</option>
                <option value="controllers">Controllers</option>
                <option value="servers">CCURE</option>
                <option value="pcdetails">Desktop Details</option>
                <option value="dbdetails">DB Server</option>
    helth chekc for this device can you redeisn the wiht real page and professl and clean desinok 
    you do this ok ... 

    read below all code careflly, and desing thes ok more atracive 
      <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Device Dashboard</title>


    <!-- >>>>>>>>>>>>>>>>>>>> -->
    <!-- <link rel="icon" type="image/png" href="images/favicon-96x96.png"/> -->

    <!-- >>>>>>>>>>>>>>>>>>>> -->
    <link rel="icon" href="images/favicon.png" sizes="32x32" type="images/png">

    <link rel="stylesheet" href="styles.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">


    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

</head>

<body>

    <button id="scrollToTopBtn" title="Go to top">
        <i class="bi bi-chevron-double-up"></i>
    </button>


    <div id="region-title" class="dashboard-header">

        <div class="region-logo">
        </div>
            

          
    </div>

    <div class="container">
        <!-- Sidebar -->
        <aside id="sidebar">
            <!-- <h2><i class="fas fa-globe"></i></h2> -->
            <button class="region-button" data-region="global"><i class="fas fa-globe"></i> Global</button>
            <button class="region-button" data-region="apac"><i class="fas fa-map-marker-alt"></i> APAC</button>
            <button class="region-button" data-region="emea"><i class="fas fa-map-marker-alt"></i> EMEA</button>
            <button class="region-button" data-region="laca"><i class="fas fa-map-marker-alt"></i> LACA</button>
            <button class="region-button" data-region="namer"><i class="fas fa-map-marker-alt"></i> NAMER</button>

            <button class="nav-button" onclick="location.href='trend.html'"><i class="fas fa-chart-line"></i> View Trend
                Analysis</button>
            <button class="nav-button" onclick="location.href='summary.html'"><i class="fas fa-table"></i> View Devices
                Summary</button>

            <div id="countdown" class="countdown-timer">Loading Timer...</div>

            <div class="filter-buttons">
                <button id="filter-all" class="status-filter active" data-status="all"><i
                        class="fas fa-layer-group"></i> All Devices</button>
                <button id="filter-online" class="status-filter" data-status="online"><i class="fas fa-wifi"></i> Online
                    Devices</button>
                <button id="filter-offline" class="status-filter" data-status="offline"><i
                        class="fas fa-plug-circle-xmark"></i> Offline Devices</button>
            </div>

            <label for="device-filter">Filter by Device Type:</label>
            <select id="device-filter">
                <option value="all">All</option>
                <option value="cameras">Cameras</option>
                <option value="archivers">Archivers</option>
                <option value="controllers">Controllers</option>
                <option value="servers">CCURE</option>
                <option value="pcdetails">Desktop Details</option>
                <option value="dbdetails">DB Server</option>
            </select>






            <label for="vendorFilter" id="vendorFilterLabel">Filter by Camera:</label>
            <select id="vendorFilter">
                <option value="all">All camera</option>
            </select>

            <label for="city-filter">Filter by Location:</label>
            <select id="city-filter">
                <option value="all">All Cities</option>
            </select>

        </aside>


        <!-- Main Content -->
        <main id="content">


            <div class="summary">
                <div class="card">

                    <h3><i class="fas fa-microchip icon-3d"></i> Total Devices</h3>
                    <div class="card-status total">Total <span id="total-devices">0</span></div>
                    <div class="card-status online">Online <span id="online-devices">0</span></div>
                    <div class="card-status offline">Offline <span id="offline-devices">0</span></div>
                </div>

                <div class="card">
                    <h3><i class="fas fa-video icon-3d"></i> Cameras</h3>
                    <div class="card-status total">Total <span id="camera-total">0</span></div>
                    <div class="card-status online">Online <span id="camera-online">0</span></div>
                    <div class="card-status offline">Offline <span id="camera-offline">0</span></div>
                </div>



                <div class="card">
                    <h3><i class="fas fa-database icon-3d"></i> Archivers</h3>

                    <div class="card-status total">Total <span id="archiver-total">0</span></div>
                    <div class="card-status online">Online <span id="archiver-online">0</span></div>
                    <div class="card-status offline">Offline <span id="archiver-offline">0</span></div>
                </div>

                <div class="card">
                    <h3><i class="fas fa-id-card icon-3d"></i> Controllers</h3>
                    <div class="card-status total">Total <span id="controller-total">0</span></div>
                    <div class="card-status online">Online <span id="controller-online">0</span></div>
                    <div class="card-status offline">Offline <span id="controller-offline">0</span></div>
                </div>

                <div class="card">
                    <h3><i class="fas fa-server icon-3d"></i>CCURE</h3>
                    <div class="card-status total">Total <span id="server-total">0</span></div>
                    <div class="card-status online">Online <span id="server-online">0</span></div>
                    <div class="card-status offline">Offline <span id="server-offline">0</span></div>
                </div>




                <div class="card">
                    <h3><i class="fas fa-desktop icon-3d"></i>Desktop</h3>
                    <div class="card-status total">Total <span id="pc-total">0</span></div>
                    <div class="card-status online">Online <span id="pc-online">0</span></div>
                    <div class="card-status offline">Offline <span id="pc-offline">0</span></div>
                </div>

                <div class="card">
                    <h3><i class="fa-etch fa-solid fa-database icon-3d"></i>DB Server</h3>
                    <div class="card-status total">Total <span id="db-total">0</span></div>
                    <div class="card-status online">Online <span id="db-online">0</span></div>
                    <div class="card-status offline">Offline <span id="db-offline">0</span></div>
                </div>



            </div>

            <!-- <hr class="section-divider"> -->


            <!-- Device Details -->
            <section id="details-section" class="details-section">
                <div class="details-header">
                    <h2><i class="fas fa-microchip"></i> Device Details</h2>
                    <input type="text" id="device-search" placeholder="🔍 Search by IP, Location, City..." />
                </div>

                <div id="device-details" class="device-grid">Loading...</div>
                <div id="details-container" class="device-grid"></div>
            </section>

        </main>
    </div>


    <!-- Modal -->
    <div id="modal">
        <div class="modal-content">
            <span id="close-modal">&times;</span>
            <h3 id="modal-title">Device Details</h3>
            <ul id="modal-body"></ul>
        </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
        <p>
            <img src="images/new-header.png" alt="Company Logo" class="footer-logo" />
        </p>

        <p style="color: #fff;">&copy; 2025 VisionWatch | Powered by <strong style="color: #ffcc00;">Western Union
                Services India Pvt Ltd.</strong></p>
        <p style="color: #fff;">Contact:
            <a href="mailto:gsoc-globalsecurityoperationcenter.sharedmailbox@westernunion.com">Email</a> |
            <a href="tel:+912067632394">+91 20 67632394</a>
        </p>
    </footer>

    <script src="script.js"></script>
</body>

</html>
              
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

/* C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\styles.css */

/* ===== Reset & Base Styles ===== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #f9fafc;
 
  color: #212529;
  line-height: 1.6;
  min-height: 100vh;
  padding-top: 70px;
  margin: 0;
  font-family: Roboto, "Noto Sans", sans-serif;
  /* font-family: Roboto; */

}

/* 000 */
#scrollToTopBtn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 100;
  background-color: #0d6efd;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: none;
  border-radius: 50%;
  padding: 15px;
  font-size: 18px;
  cursor: pointer;
  display: none;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

#scrollToTopBtn:hover {
  background-color: #0b5ed7;
  transform: scale(1.1);
}


/* 0000 */
a {

  color: #0d6efd;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}



.container {
  display: flex;
  height: auto;
}


/* ===== Sidebar ===== */

/* ===== Enhanced Sidebar ===== */
#sidebar {
  margin-top: -25px;
  width: 240px;
  background: #ffdd00;
  border-right: 1px solid #e1e1e1;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.03);
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #000000;
  gap: 5px;
}

#sidebar h2 {
  font-size: 18px;
  color: #000000;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
}

#sidebar label {
  color: #000000;
}

.region-button,
.nav-button,
.status-filter {
  color: #000000;
  background-color: #f1f3f5;
  border: 1px solid #dee2e6;
  padding: 12px 16px;
  margin-bottom: 10px;
  text-align: left;
  border-radius: 5px;  
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #000000;
  outline: none;

}

.region-button:hover,
.nav-button:hover,
.status-filter:hover {
  background-color: #e9ecef;
  transform: scale(1.03);
}

.status-filter.active {
  background-color: #0d6efd;
  color: #fff;
}

select {
  background-color: #f1f3f5;
  padding: 10px;
  border-radius: 5px;
  border: none;
  color: #000000;
  margin-bottom: 14px;
  font-size: 16px;
  border: 1px solid #000000;
}


/*  */

/* Global */
.region-button[data-region="global"] i {
  color: #00adb5;
  /* Teal */
}

/* APAC */
.region-button[data-region="apac"] i {
  color: #EA4335;
  /* Orange */
}

/* EMEA */
.region-button[data-region="emea"] i {
  color: #EA4335;
  /* Deep Orange */
}

/* LACA */
.region-button[data-region="laca"] i {
  color: #EA4335;
  /* Purple */
}

/* NAMER */
.region-button[data-region="namer"] i {
  color: #EA4335;
  /* Blue */
}

/* Trend Analysis */
.nav-button i.fas.fa-chart-line {
  color: #1abc9c;
  /* Green Cyan */
}

/* Summary */
.nav-button i.fas.fa-table {
  color: #d35400;
  /* Rust Orange */
}

/* All Devices */
.status-filter[data-status="all"] i {
  color: #bdc3c7;
  /* Silver */
}

/* Online Devices */
.status-filter[data-status="online"] i {
  color: #2ecc71;
  /* Green */
}

/* Offline Devices */
.status-filter[data-status="offline"] i {
  color: #e74c3c;
  /* Red */
}

/*  */
/* Colorful Icons */


.status-filter[data-status="offline"] i {
  color: #e84118;
}

label {
  font-size: 14px;
  color: #000000;
  margin-top: 8px;
}



/* ===== Main Content ===== */
#content {
  flex: 1;
  padding: 20px 30px;
  overflow-y: auto;
}


/* === Default (Desktop) === */
#region-title {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background-color: #000000;
  color: #ffdd00;
  border-bottom: 3px solid #ffdd00;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
  font-size: 35px;
  /* border-bottom: 1px solid #000000; */
  /* border-top: 1px solid #000000; */
  font-family: "PP Right Grotesk";
  font-weight: 600;

}

#region-title .region-logo {
  position: absolute;
  left: 50px;
 
  z-index: 1000;

}

/* Base icon styling */
#region-title .region-logo a {
  color: white;
  font-size: 25px;
  text-decoration: none;
  position: relative;
}

/* Tooltip container */
.tooltip .tooltiptext {
  visibility: hidden;
  opacity: 0;
  width: 140px;
  background-color: #000000;
  color: #fff;
  text-align: center;
  padding: 6px;
  position: absolute;
  top: 150%; /* position above icon */
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


/* === Tablets (768px – 1024px) === */
@media (max-width: 1024px) {
  #region-title {
    font-size: 28px;
    padding: 20px;
  }

  #region-title img {
    height: 35px;
  }
}

/* === Mobile (480px – 767px) === */
@media (max-width: 767px) {
  #region-title {
    font-size: 22px;
    padding: 16px;
  }

  #region-title img {
    height: 30px;
  }
}

/* === Extra Small Devices (less than 480px) === */
@media (max-width: 479px) {
  #region-title {
    font-size: 18px;
    padding: 12px;
  }

  #region-title img {
    height: 26px;
  }
}


/* ===== Summary Cards ===== */

/* Grid layout for cards */

/* ===== Fade In Animation ===== */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}


.open-camera-btn {
  background-color: rgb(240, 248, 252);


}

.open-camera-btn .bi-webcam:hover {
  color: red;

}

/* ===== Modal ===== */
#modal {
  display: none;
  position: fixed;
  z-index: 10;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.modal-content {
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  color: #f1f1f1;
}

#close-modal {
  float: right;
  font-size: 24px;
  cursor: pointer;
  color: #fbc531;
}

#modal-title {
  font-size: 20px;
  margin-bottom: 15px;
}

#modal-body li {
  margin-bottom: 8px;
  font-size: 14px;
}

/* ===== Countdown Timer ===== */
.countdown-timer {
  font-size: 14px;
  /* color: #f1f1f1; */
  color: #000000;
  margin-top: 15px;
}

/* ===== Footer ===== */

.footer {
  text-align: center;
  padding: 20px;
  font-size: 14px;
  border-top: 1px solid #2c2c3e;
background-color: #000000;

}


.footer-logo {
  height: 25px;
  /* width: 120px; */
  margin-bottom: 10px;
}

/* ===== Responsive Adjustments ===== */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  #sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #2c2c3e;
  }

  .summary {
    grid-template-columns: 1fr;
  }

  .device-grid {
    grid-template-columns: 1fr;
  }
}

/* ************************************************* */
/* top card section  */
.icon-3d {
  font-size: 26px;
  margin-right: 10px;
  padding: 7px;
  border-radius: 12px;
  background: #ffcc00;
  color: #00ffe5;
  transition: transform 0.3s ease;
}

.region-logo img {
  height: 10px;
  width: auto;
  object-fit: contain;
}

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

:root {
  --yellow: #ffcc00;
  --black: #0f0f0f;
  --dark-gray: #1a1a1a;
  --gray: #2b2b2b;
  --white: #f5f5f5;
  --green: #2cb67d;
  --red: #ef4565;
  --blue: #00adb5;
}

/* ===== Layout ===== */
.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.50rem;
}

/* ===== Card Design ===== */
.card {
  background: #f0f8fc;
  border: 1px solid #131313;
  border-radius: 16px;
  padding: 18px;
  position: relative;
  border: 2px solid transparent;
  background-clip: padding-box;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 2px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--card-border));
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;
  pointer-events: none;
  border: 1px solid #000000;
}

/* ===== Card Title ===== */
.card h3 {
  font-size: 20px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-family: "PP Right Grotesk"
}

.card h3 i {
  color: #000000bd;
}

/*  */

/* ===== Status Boxes ===== */
.card-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 11px;
  margin-bottom: 12px;
  border-radius: 10px;
  font-size: 18px;
  color: black;
}

/* Specific Status Styling */
.card-status.total {
  border: 1px solid #0a0b0b;
  font-size: 18px;
  border-left: 4px solid;
  border-left-color: #121212;
  background-color: #ffdd00 !important;
  color: black;
  font-weight: 500;
}

.card-status.online {
  border: 1px solid black;
  border-left: 2px solid;
  font-size: 18px;
  background-color: #32CD32 !important;
  font-weight: 500;
}

.card-status.offline {
  border: 1px solid black;
  border-left: 2px solid;
  font-size: 18px;
  background-color: #FF0000 !important;
  font-weight: 500;
}



/* ===== Badge/Text inside card-status ===== */
.card-status span {
  font-size: 18px;
}

/* ===== Divider ===== */
.section-divider {
  border: none;
  height: 2px;
  background: gray;
  border-radius: 4px;
  opacity: 0.8;
}

/* ===== Responsive Adjustments ===== */
@media screen and (max-width: 600px) {
  .summary {
    padding: 1rem;
  }

  .card h3 {
    font-size: 1.1rem;
  }

  .card-status {
    font-size: 0.9rem;
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}

/* top card section  */


/* ===== Dark Theme Root Styling ===== */

.details-section {
  color: black;
}

/* ===== Header Section ===== */
.details-header {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #333;
  gap: 50px;

}

.details-header h2 {
  font-size: 20px;
  color: black;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: "PP Right Grotesk";
  font-weight: 500;


}

.details-header h2 i {
  color: #00adb5;
}

#device-search {
  padding: 10px;
  border-radius: 6px;
  background-color: #ffffff;
  border: 1px solid #000000;
  color: #000000;
  width: 340px;
  font-size: 15px;
  outline: none;
}

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


.card-content {}


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
