ok,,
  now how to do this in frontend... 
    first see my dashboard ok 
http://localhost/api/controllers/status
[
  {
    "controllername": "IN-PUN-2NDFLR-ISTAR PRO",
    "IP_address": "10.199.13.10",
    "controllerStatus": "Online",
    "Doors": [
      {
        "Door": "APAC_IN_PUN_2NDFLR_IDF ROOM_10:05:86 Restricted Door",
        "Reader": "in:1",
        "status": "Online"
      },
      {
        "Door": "APAC_IN_PUN_2NDFLR_UPS/ELEC ROOM Restricted Door_10:05:FE",
        "Reader": "in:1",
        "status": "Online"
      },
      {
        "Door": "APAC_IN_PUN_2NDFLR_RECPTION TO WORKSTATION DOOR_10:05:4B",
        "Reader": "in:1",
        "status": "Online"
      },
      {
        "Door": "APAC_IN_PUN_2NDFLR_RECPTION TO WORKSTATION DOOR_10:05:4B",
        "Reader": "out:1",
        "status": "Online"
      },
      {
        "Door": "APAC_IN_PUN_2NDFLR_LIFTLOBBY TO RECEPTION EMTRY DOOR_10:05:74",
        "Reader": "in:1",
        "status": "Online"
      },
      {
        "Door": "APAC_IN_PUN_2NDFLR_LIFTLOBBY TO WORKSTATION DOOR_10:05:F0",
        "Reader": "",
        "status": "Online"
      }
    ]
  },
  {
    "controllername": "IN-PUN-PODIUM-ISTAR PRO-01",
    "IP_address": "10.199.8.20",
    "controllerStatus": "Online",
    "Doors": [
      {
        "Door": "APAC_IN-PUN-PODIUM-RED-RECREATION AREA FIRE EXIT 1-DOOR",
        "Reader": "",
        "status": "Online"
      },
      {
        "Door": "APAC_IN_PUN_PODIUM_RED_IDF ROOM-02-Restricted Door",
        "Reader": "in:1",
        "status": "Online"
      },
      {
        "Door": "APAC_IN-PUN-PODIUM-MAIN PODIUM LEFT ENTRY-DOOR",
        "Reader": "in:1",
        "status": "Online"
      },
      {
        "Door": "APAC_IN_PUN_PODIUM_MAIN PODIUM RIGHT ENTRY-DOOR",
        "Reader": "in:1",
        "status": "Online"
      },
      {
        "Door": "APAC_IN-PUN-PODIUM-RED-RECEPTION TO WS ENTRY 1-DOOR",
        "Reader": "",
        "status": "Online"
      },
      {
        "Door": "APAC_IN_PUN_PODIUM_ST2 DOOR 1 (RED)",
        "Reader": "in:1",
        "status": "Online"
      },

      this is my main dashboard 
      C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\index.html
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
    <!-- <link rel="stylesheet" href="incss.css" /> -->

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
         <div class="header-controls">
            <button class="theme-toggle" id="themeToggle">
                <i class="fas fa-moon"></i>
            </button>
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
    <script>
        // Theme Toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('theme-light');
            const icon = themeToggle.querySelector('i');
            if (document.body.classList.contains('theme-light')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });



    </script>

</body>

</html>


GLOBAL Summary

Global

APAC

EMEA

LACA

NAMER

View Trend Analysis

View Devices Summary
Refreshing in 292 seconds

All Devices

Online Devices

Offline Devices
Filter by Device Type:

Archivers
Filter by Location:

All Cities
Total Devices
Total
21
Online
21
Offline
0
Cameras
Total
0
Online
0
Offline
0
Archivers
Total
21
Online
21
Offline
0
Controllers
Total
0
Online
0
Offline
0
CCURE
Total
0
Online
0
Offline
0
Desktop
Total
0
Online
0
Offline
0
DB Server
Total
0
Online
0
Offline
0
Device Details
🔍 Search by IP, Location, City...
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

Archiver Pune-podium flr- India
 ARCHIVERS

 10.199.8.10

 APAC

 Pune Podium

Online

Archiver Pune_Tower B
 ARCHIVERS

 10.199.16.45

 APAC

 Pune Tower B

Online

Archiver Pune_2nd Flr
 ARCHIVERS

 10.199.8.12

 APAC

 Pune 2nd Floor

Online

Archiver Server Kuala Lumpur
 ARCHIVERS

 10.192.5.9

 APAC

 Kuala lumpur

Online

Archiver AUT-VIE
 ARCHIVERS

 10.128.203.3

 EMEA

 Delta Building

Online

Archiver Dublin(new)
 ARCHIVERS

 10.128.218.70

 EMEA

 Ireland, Dublin

Online

Archiver New Rome
 ARCHIVERS

 10.131.106.133

 EMEA

 Italy, Rome

Online

Archiver Vilnius_ Delta
 ARCHIVERS

 10.138.33.9

 EMEA

 Delta Building

Online

Archiver Vilnius GAMA
 ARCHIVERS

 10.138.161.4

 EMEA

 Gama Building

Online

Archiver Moscow
 ARCHIVERS

 10.136.63.236

 EMEA

 Moscow

Online

Archiver Madrid
 ARCHIVERS

 10.128.194.70

 EMEA

 Madrid

Online

Archiver server Costa Rica 2
 ARCHIVERS

 10.64.21.66

 LACA

 Costa Rica

Online

Archiver server Costa Rica 1
 ARCHIVERS

 10.64.21.67

 LACA

 Costa Rica

Online

Archiver server Costa Rica 3
 ARCHIVERS

 10.64.21.85

 LACA

 Argentina

Online

Archiver CDMX MROC 01
 ARCHIVERS

 172.21.34.200

 LACA

 Mexico

Online

Archiver Brazil 1
 ARCHIVERS

 10.68.3.84

 LACA

 Sao Paulo, Brazil

Online

Archiver OBS1
 ARCHIVERS

 10.58.8.10

 NAMER

 Denver Colorado

Online

Archiver OBS2
 ARCHIVERS

 10.58.8.12

 NAMER

 Denver Colorado

Online

Archiver OBS3
 ARCHIVERS

 10.58.8.14

 NAMER

 Denver Colorado

Online

Company Logo

© 2025 VisionWatch | Powered by Western Union Services India Pvt Ltd.

Contact: Email | +91 20 67632394


