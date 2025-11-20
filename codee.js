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
    background: var(--bg-card);
    box-shadow: 0 6px 20px var(--shadow);
    display: flex;
    flex-direction: column;
    max-width: 922px;
    border: 1px solid var(--border-color);
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
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    font-size: 10px;
    color: var(--text-primary);
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
    background: var(--bg-primary);
    color: var(--text-primary);
    border: none;
    cursor: pointer;
    font-size: 10px;
}

.map-controls button {
    padding: 2px;
    gap: 2px;
}

.map-controls .btn-ghost {
    background: transparent;
    border: 1px solid var(--border-color);
    cursor: pointer;
    font-weight: 600;
    margin-right: 5px;
    color: var(--text-primary);
}

.map-controls .btn-gv {
    background-color: var(--bg-primary);
    color: var(--text-primary);
}

/* RIGHT PANEL */
.region-panel {
    flex: 0 0 200px;
    max-width: 100%;
    height: 100%;
    background: var(--bg-card);
    font-size: 10px;
    padding: 5px;
    box-shadow: 0 6px 20px var(--shadow);
    overflow-y: auto;
    border: 1px solid var(--border-color);
    color: var(--text-primary);
}

.panel-title {
    font-size: 10px;
    font-weight: 700;
    margin-bottom: 5px;
    white-space: normal;
    color: var(--text-primary);
}

.panel-content {
    max-height: 340px;
    overflow-y: auto;
    margin-bottom: 18px;
    word-wrap: break-word;
}

/* FILTER SECTION */
.filter-block {
    border-top: 1px solid var(--border-color);
    padding-top: 14px;
}

.filter-select {
    width: 100%;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid var(--border-color);
    margin-bottom: 10px;
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.filter-actions {
    display: flex;
    gap: 10px;
}

/* CITY MARKERS */
.city-marker .pin {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 4px;
}

/* Label Box */
.city-label-box {
    background: rgba(0,0,0,0.75);
    padding: 6px 10px;
    border-radius: 6px;
    color: #00ff99;
    font-size: 13px;
    border: 1px solid #00ff99;
    box-shadow: 0 0 8px rgba(0,255,120,0.5);
}

/* Dotted Path */
.city-dotted-path {
    color: #ffaa00;
    weight: 2;
    dashArray: "4 6";
}

/* Layout + Text */
body {
    background: var(--bg-primary);
    color: var(--text-primary);
}

.container { 
    display:flex; 
    gap:12px; 
    padding:12px; 
    align-items:flex-start; 
}

.map-card {
    flex:1;
    min-width:720px;
    background: var(--bg-card);
    border-radius:10px;
    padding:12px;
    box-shadow:0 6px 20px var(--shadow);
    border: 1px solid var(--border-color);
}

.panel {
    width:360px;
    background: var(--bg-card);
    border-radius:10px;
    padding:12px;
    box-shadow:0 6px 20px var(--shadow);
    overflow:auto;
    max-height:920px;
    border: 1px solid var(--border-color);
}

/* Hover Colors */
.city-item {
    padding: 3px 6px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid var(--border-color);
    margin-bottom: 6px;
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.city-item:hover {
    background: var(--bg-primary);
}

.small-muted { 
    color: var(--text-secondary); 
    font-size:10px; 
}