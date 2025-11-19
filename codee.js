/* WORLD MAP WRAPPER - FLEX FIX */
.worldmap-wrapper {
    display: flex;
    gap: 14px;
    width: 100%;
    align-items: flex-start;
    flex-wrap: nowrap;       /* keep map and panel side by side */
    overflow-x: hidden;      /* prevent horizontal scroll */
}

/* RIGHT PANEL */
.region-panel {
    flex: 0 0 330px;         /* fixed width but can shrink if needed */
    max-width: 100%;         /* never exceed parent width */
    height: 100%;
    background: #fff;
    border-radius: 12px;
    padding: 14px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.06);
    overflow-y: auto;        /* vertical scroll only */
}

/* PANEL CONTENT */
.panel-content {
    max-height: 340px;
    overflow-y: auto;
    margin-bottom: 18px;
    word-wrap: break-word;   /* prevent long text causing horizontal overflow */
}

/* FILTER SECTION */
.filter-block {
    border-top: 1px solid rgba(0,0,0,0.08);
    padding-top: 14px;
}

/* Optional: adjust panel title */
.panel-title {
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 12px;
    white-space: normal;     /* allow title to wrap instead of overflowing */
}