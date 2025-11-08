

            <div class="summary">
                <div class="card">

i want to summary card get full widh 
              then belwo summary card sidebard came ok s
    so how to do this 
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



/* ===== Main Content ===== */
#content {
  flex: 1;
  /* padding: 20px 30px; */
  overflow-y: auto;
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
            <button class="nav-button" onclick="location.href='controllers.html'"><i class="fas fa-table"></i> View Devices
                Door</button>

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
