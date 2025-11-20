i want to decreas the width for map it is. map widht is very big.
   how to decreaseu widht 
<div class="right-panel">
              <!-- <div class="gcard tall"> -->
              <div class="">
                <div class="worldmap-wrapper">

                  <!-- MAP CARD -->
                  <div class="worldmap-card">

                    <div id="realmap"></div>

                    <!-- Legend + Controls Row -->
                    <div class="map-bottom-bar">

                      <!-- Legend -->
                      <div class="legend">
                        <div class="legend-item">
                          <div class="legend-box" style="background:#10b981"></div> Camera
                        </div>
                        <div class="legend-item">
                          <div class="legend-box" style="background:#f97316"></div> Controller
                        </div>
                        <div class="legend-item">
                          <div class="legend-box" style="background:#7c3aed"></div> Server
                        </div>
                        <div class="legend-item">
                          <div class="legend-box" style="background:#2563eb"></div> Archiver
                        </div>
                      </div>

                      <!-- Controls -->
                      <div class="map-controls">
                        <button id="fit-all" class="btn-ghost">Fit All</button>
                        <button id="show-global" class="btn">Global View</button>
                      </div>

                    </div>
                  </div>

                  <!-- SIDE PANEL -->
                  <div class="region-panel" id="region-panel">
                    <h4 class="panel-title">Global (City Overview)</h4>

                    <div id="region-panel-content" class="panel-content"></div>

                    <div class="filter-block">
                      <h5>Filters</h5>

                      <select id="filter-type" class="filter-select">
                        <option value="all">All device types</option>
                        <option value="camera">Camera</option>
                        <option value="controller">Controller</option>
                        <option value="server">Server</option>
                        <option value="archiver">Archiver</option>
                      </select>

                      <select id="filter-status" class="filter-select">
                        <option value="all">All Status</option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                      </select>

                      <div class="filter-actions">
                        <button id="apply-filters" class="btn">Apply</button>
                        <button id="reset-filters" class="btn-ghost">Reset</button>
                      </div>

                    </div>
                  </div>

                </div>
              </div>

    /* WORLD MAP WRAPPER - FLEX FIX */
.worldmap-wrapper {
    display: flex;
    gap: 14px;
    width: 100%;

    align-items: flex-start;
    flex-wrap: nowrap;      
    overflow-x: hidden;      
}




/* MAIN MAP CARD */
.worldmap-card {
    flex: 1;
    background: #fff;
    box-shadow: 0 6px 20px rgba(0,0,0,0.06);
    display: flex;
    flex-direction: column;
    min-width: 620px;
}

#realmap {
    height: 550px;
    width: 100%;
    
}

/* BOTTOM ROW UNDER MAP */
.map-bottom-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* LEGEND */
.legend {
    display: flex;
    flex-wrap: wrap;
}

.legend-item {
    display: flex;
    align-items: center;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.08);
    font-size: 10px;
}

.legend-box {
    width: 10px;
    height: 10px;
}

/* CONTROL BUTTONS */
.map-controls {
    display: flex;
   
}

.btn {
    background: #111827;
    color: #fff;
    border: none;
    cursor: pointer;
    font-size: 10px;
}

.btn-ghost {
    padding: 7px 12px;
    background: transparent;
    border: 1px solid rgba(0,0,0,0.12);
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
}

/* RIGHT PANEL */
.region-panel {
    /* flex: 0 0 330px;          */
    flex: 0 0 200px;         
    max-width: 100%;         
    height: 100%;
    background: #fff;
    /* border-radius: 12px; */
    font-size: 10px;
    padding: 5px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.06);
    overflow-y: auto;       
}

.panel-title {
    font-size: 10px;
    font-weight: 700;
    margin-bottom: 5px;
    white-space: normal;     
}

.panel-content {
    max-height: 340px;
    overflow-y: auto;
    margin-bottom: 18px;
    word-wrap: break-word;   
}

/* FILTER SECTION */
.filter-block {
    border-top: 1px solid rgba(0,0,0,0.08);
    padding-top: 14px;
}

.filter-select {
    width: 100%;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid rgba(0,0,0,0.15);
    margin-bottom: 10px;
}

.filter-actions {
    display: flex;
    gap: 10px;
}
.city-marker .pin {
  width: 10px;
  height: 10px;
  color: rgb(208, 31, 31);
  border-radius: 50%;
  margin-right: 4px;
}
.city-label-box {
  background: rgba(0,0,0,0.75);
  padding: 6px 10px;
  border-radius: 6px;
  color: #00ff99;
  font-size: 13px;
  border: 1px solid #00ff99;
  box-shadow: 0 0 8px rgba(0,255,120,0.5);
}

.city-dotted-path {
  color: #ffaa00;
  weight: 2;
  dashArray: "4 6";
}    
    
    
    
    body { margin:0; font-family: Inter, Roboto, Arial, sans-serif; background:#f6f7fb; color:#0f172a; }
    .container { display:flex; gap:12px; padding:12px; align-items:flex-start; }
    .map-card { flex:1; min-width:720px; background:#fff; border-radius:10px; padding:12px; box-shadow:0 6px 20px rgba(10,10,20,0.06); }
    .panel { width:360px; background:#fff; border-radius:10px; padding:12px; box-shadow:0 6px 20px rgba(10,10,20,0.06); overflow:auto; max-height:920px; }

    .dev-icon { display:flex; align-items:center; justify-content:center; width:36px; height:36px; border-radius:8px; color:#fff; }
    .dev-glow { box-shadow: 0 0 10px 3px rgba(0,200,0,0.22); }
    .dev-glow-off { box-shadow: 0 0 10px 3px rgba(200,0,0,0.14); opacity:0.95; }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(0,200,0,0.30); }
      70% { box-shadow: 0 0 0 12px rgba(0,200,0,0); }
      100% { box-shadow: 0 0 0 0 rgba(0,200,0,0); }
    }
    .pulse { animation: pulse 2s infinite; border-radius: 50%; }

    .region-label { background: rgba(0,0,0,0.6); color:#fff; padding:6px 8px; border-radius:6px; font-weight:700; }
    .stat-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid rgba(15,23,42,0.04); }
    .badge { display:inline-block; padding:4px 8px; border-radius:999px; font-weight:700; font-size:13px; }
    .badge-apac { background:#0ea5e9; color:#fff; }
    .badge-emea { background:#34d399; color:#fff; }
    .badge-namer { background:#fb923c; color:#fff; }
    .badge-laca { background:#a78bfa; color:#fff; }

    .legend { display:flex; gap:8px; flex-wrap:wrap; margin-top:8px; }
    .legend-item { display:flex; gap:8px; align-items:center; padding:4px 8px; border-radius:6px; background:#fff; border:1px solid rgba(10,10,20,0.04); }

    .controls { display:flex; gap:8px; align-items:center; }

    .city-list { margin-top:8px; max-height:380px; overflow:auto; }


.city-item {
    padding: 3px 6px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid rgba(15, 23, 42, 0.03);
    margin-bottom: 6px;
}

.city-item:hover {
    background: #f1f5f9;
}
    .small-muted { color:#475569; font-size:10px; }
    .btn { padding:6px 10px; border-radius:6px; border: none; cursor:pointer; background:#111827; color:#fff; font-weight:600; }
    .btn-ghost { background:transparent; color:#111827; border:1px solid rgba(15,23,42,0.06); }

            </div>
