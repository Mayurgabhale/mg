/* WRAPPER - Map + Side Panel */
.worldmap-wrapper {
    display: flex;
    gap: 14px;
    width: 100%;
    align-items: flex-start;
}

/* MAIN MAP CARD */
.worldmap-card {
    flex: 1;
    background: #fff;
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.06);
    display: flex;
    flex-direction: column;
}

/* MAP CANVAS */
#realmap {
    height: 650px;
    width: 100%;
    border-radius: 10px;
}

/* BOTTOM ROW UNDER MAP */
.map-bottom-bar {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* LEGEND */
.legend {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.legend-item {
    display: flex;
    gap: 6px;
    align-items: center;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.08);
    padding: 5px 8px;
    border-radius: 6px;
}

.legend-box {
    width: 16px;
    height: 16px;
    border-radius: 4px;
}

/* CONTROL BUTTONS */
.map-controls {
    display: flex;
    gap: 8px;
}

.btn {
    padding: 7px 12px;
    background: #111827;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
}

.btn-ghost {
    padding: 7px 12px;
    background: transparent;
    border: 1px solid rgba(0,0,0,0.12);
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
}

/* SIDE PANEL */
.region-panel {
    width: 330px;
    height: 100%;
    background: #fff;
    border-radius: 12px;
    padding: 14px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.06);
}

.panel-title {
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 12px;
}

.panel-content {
    max-height: 340px;
    overflow-y: auto;
    margin-bottom: 18px;
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