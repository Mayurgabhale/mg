i want correct World Device Map section wiht perfect adjustment and atractive layout desing ok 
C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\index.html
<!-- Right SIDE MAP PANEL -->
            <div class="right-panel">
              <div class="gcard tall">
                <h4 class="gcard-title">World Device Map</h4>

                <div class="map-placeholder">

                  <div class="map-card">
                    
                    <div id="realmap"></div>

                    <div style="margin-top:8px; display:flex; justify-content:space-between; align-items:center;">
                      <div class="legend">
                        <div class="legend-item">
                          <div style="width:18px;height:18px;background:#10b981;border-radius:4px"></div> Camera
                        </div>
                        <div class="legend-item">
                          <div style="width:18px;height:18px;background:#f97316;border-radius:4px"></div> Controller
                        </div>
                        <div class="legend-item">
                          <div style="width:18px;height:18px;background:#7c3aed;border-radius:4px"></div> Server
                        </div>
                        <div class="legend-item">
                          <div style="width:18px;height:18px;background:#2563eb;border-radius:4px"></div> Archiver
                        </div>
                      </div>

                      <div class="controls" id="map-controls" style="font-size:13px; color:#334155;">
                        <button id="toggle-heat" class="btn-ghost">Toggle Heat</button>
                        <button id="fit-all" class="btn-ghost">Fit All</button>
                        <button id="show-global" class="btn">Show Global</button>
                      </div>
                    </div>
                  </div>

                  <div class="panel" id="region-panel">
                    <h4>Global (city-wise)</h4>
                    <div id="region-panel-content"></div>

                    <div style="margin-top:12px">
                      <h5>Filters (optional)</h5>
                      <select id="filter-type" style="width:100%; padding:8px; margin-bottom:8px;">
                        <option value="all">All device types</option>
                        <option value="camera">Camera</option>
                        <option value="controller">Controller</option>
                        <option value="server">Server</option>
                        <option value="archiver">Archiver</option>
                      </select>

                      <select id="filter-status" style="width:100%; padding:8px; margin-bottom:8px;">
                        <option value="all">All status</option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                      </select>

                      <div style="display:flex; gap:8px;">
                        <button id="apply-filters" class="btn">Apply</button>
                        <button id="reset-filters" class="btn-ghost">Reset</button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\map.css

    body { margin:0; font-family: Inter, Roboto, Arial, sans-serif; background:#f6f7fb; color:#0f172a; }
    .container { display:flex; gap:12px; padding:12px; align-items:flex-start; }
    .map-card { flex:1; min-width:720px; background:#fff; border-radius:10px; padding:12px; box-shadow:0 6px 20px rgba(10,10,20,0.06); }
    .panel { width:360px; background:#fff; border-radius:10px; padding:12px; box-shadow:0 6px 20px rgba(10,10,20,0.06); overflow:auto; max-height:920px; }

    #realmap { height: 720px; width: 100%; border-radius:8px; }

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
    .city-item { padding:8px 6px; border-radius:6px; cursor:pointer; display:flex; justify-content:space-between; align-items:center; border:1px solid rgba(15,23,42,0.03); margin-bottom:6px; }
    .city-item:hover { background: #f1f5f9; }
    .small-muted { color:#475569; font-size:13px; }
    .btn { padding:6px 10px; border-radius:6px; border: none; cursor:pointer; background:#111827; color:#fff; font-weight:600; }
    .btn-ghost { background:transparent; color:#111827; border:1px solid rgba(15,23,42,0.06); }


C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\graph.css

/* Right panel  */
/* .right-panel .gcard.tall {
  height: calc(100% + 0px);
  display: flex;
  flex-direction: column;
} */

.right-panel .gcard.tall {
    height: auto;
    /* remove row sync */
    min-height: 200px;
    /* set your desired map height */
    display: flex;
    flex-direction: column;
}

/* Bottom row (spans full width below left + right) */
.bottom-row {
    grid-column: 1 / -1;
    /* spans both columns */
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    margin-top: 12px;
}

/* General card */
.gcard {
    background: var(--graph-card-bg-dark);
    border: 1px solid var(--graph-card-border-dark);
    padding: 14px;
    border-radius: 12px;
    min-height: 160px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
    transition: all 0.3s ease;
}

.theme-light .gcard {
    background: var(--graph-card-bg-light);
    border: 1px solid var(--graph-card-border-light);
}

.gcard:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px var(--graph-shadow-dark);
}

.theme-light .gcard:hover {
    box-shadow: 0 8px 25px var(--graph-shadow-light);
}

/* Card title */
.gcard-title {
    font-size: 13px;
    color: var(--graph-card-title-dark);
    margin: 0 0 8px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.theme-light .gcard-title {
    color: var(--graph-card-title-light);
}

/* Small footer row in the card */
.gcard-foot.small {
    display: flex;
    justify-content: space-between;
    margin-top: auto;
    color: var(--graph-card-footer-dark);
    font-size: 12px;
}

.theme-light .gcard-foot.small {
    color: var(--graph-card-footer-light);
}

/* Placeholders for charts & map */
.map-placeholder {
    background: var(--graph-map-bg-dark);
    border-radius: 8px;
    height: 100%;
    min-height: 500px !important;
    /* adjust freely */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 12px;
    position: relative;
    color: var(--graph-map-text-dark);
    font-weight: 600;
}

.theme-light .map-placeholder {
    background: var(--graph-map-bg-light);
    color: var(--graph-map-text-light);
}

/* Simple annotation boxes for map example */
.map-annot {
    background: var(--graph-map-annot-bg-dark);
    padding: 6px 8px;
    border-radius: 6px;
    border: 1px solid var(--graph-map-annot-border-dark);
    font-size: 12px;
    text-align: center;
}

.theme-light .map-annot {
    background: var(--graph-map-annot-bg-light);
    border: 1px solid var(--graph-map-annot-border-light);
}

/* Chart placeholders */
.chart-placeholder {
    height: 120px;
    border-radius: 8px;
    margin-top: 8px;
    background: var(--graph-map-bg-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--graph-map-text-dark);
    font-weight: 600;
}

.theme-light .chart-placeholder {
    background: var(--graph-map-bg-light);
    color: var(--graph-map-text-light);
}

/* ================= Semi Donut (dashboard smaller sizing) =============== */
.semi-donut {
    --percentage: 0;
    --active: var(--graph-gauge-active);
    --inactive: var(--graph-gauge-inactive);
    width: 300px;
    height: 150px;
    position: relative;
    font-size: 22px;
    font-weight: 600;
    overflow: hidden;
    color: var(--active);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    box-sizing: border-box;
}

/* Half circle background + fill */
.semi-donut::after {
    content: '';
    width: 300px;
    height: 300px;
    border: 50px solid;
    border-color: var(--inactive) var(--inactive) var(--active) var(--active);
    position: absolute;
    border-radius: 50%;
    left: 0;
    top: 0;
    transform: rotate(calc(-45deg + var(--percentage) * 1.8deg));
    animation: fillAnimation 1s ease-in;
    box-sizing: border-box;
}

@keyframes fillAnimation {
    from {
        transform: rotate(-45deg);
    }

    to {
        transform: rotate(calc(-45deg + var(--percentage) * 1.8deg));
    }
}

/* Inside text */
.gtext {
    position: absolute;
    bottom: 8px;
    text-align: center;
    color: var(--graph-gauge-text);
}

.gtext .total {
    font-size: 20px;
    color: var(--graph-gauge-total);
    display: block;
}

.gtext small {
    font-size: 12px;
    color: var(--graph-card-footer-dark);
    display: block;
}

.theme-light .gtext small {
    color: var(--graph-card-footer-light);
}

/* Responsive */
@media (max-width: 1100px) {
    .graphs-grid.dashboard-layout {
        grid-template-columns: 1fr;
    }

    .left-grid {
        grid-template-columns: 1fr 1fr;
    }

    .bottom-row {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .graphs-section {
        padding: 16px;
    }

    .left-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .semi-donut {
        width: 250px;
        height: 125px;
    }

    .semi-donut::after {
        width: 250px;
        height: 250px;
        border-width: 40px;
    }
}

@media (max-width: 480px) {
    .graphs-section {
        padding: 12px;
    }

    .graphs-title {
        font-size: 18px;
    }

    .semi-donut {
        width: 200px;
        height: 100px;
    }

    .semi-donut::after {
        width: 200px;
        height: 200px;
        border-width: 30px;
    }

    .gtext .total {
        font-size: 18px;
    }

    .gtext small {
        font-size: 10px;
    }
}
