/* Remove all scrollbars and ensure perfect fit */
.graphs-section {
    height: 100vh;
    min-height: 100vh;
    max-height: 100vh;
    overflow: hidden !important;
    padding: 15px !important;
    margin: 0 !important;
}

.graphs-inner {
    height: 100%;
    max-height: 100%;
    overflow: hidden !important;
}

.graphs-grid.dashboard-layout {
    height: 100%;
    max-height: 100%;
    overflow: hidden !important;
    grid-template-rows: 1fr auto;
    gap: 10px !important;
}

/* Left grid adjustments */
.left-grid {
    height: 100%;
    max-height: 100%;
    overflow: hidden !important;
    grid-template-rows: repeat(2, 1fr) auto;
    gap: 8px !important;
}

/* Right panel adjustments */
.right-panel {
    height: 100%;
    max-height: 100%;
    overflow: hidden !important;
    display: flex;
    flex-direction: column;
}

/* World map container */
.worldmap-wrapper {
    height: 100%;
    max-height: 100%;
    overflow: hidden !important;
    flex: 1;
}

.worldmap-card {
    height: 100%;
    max-height: 100%;
    overflow: hidden !important;
    display: flex;
    flex-direction: column;
}

#realmap {
    flex: 1;
    min-height: 0 !important;
    max-height: 100% !important;
}

/* LOC Count chart inside right panel */
.right-panel #Loc-Count-chart {
    margin-top: 8px !important;
    height: 200px !important;
    min-height: 200px !important;
    max-height: 200px !important;
    flex-shrink: 0;
}

.right-panel #cityBarChart {
    height: 150px !important;
    max-height: 150px !important;
}

/* Bottom row adjustments */
.bottom-row {
    display: none !important; /* Hide empty bottom row */
}

/* Card height adjustments for perfect fit */
.gcard {
    min-height: 180px !important;
    max-height: 200px !important;
    height: 100%;
}

.offline-device-card {
    min-height: 200px !important;
    max-height: 220px !important;
    height: 100%;
}

/* Remove any potential overflow */
* {
    box-sizing: border-box;
}

body, html {
    overflow: hidden !important;
    margin: 0 !important;
    padding: 0 !important;
    height: 100vh;
}

/* Desktop and laptop specific optimizations */
@media (min-width: 1024px) {
    .graphs-grid.dashboard-layout {
        grid-template-columns: 1fr 1.8fr;
        gap: 12px !important;
    }
    
    .left-grid {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 1fr) auto;
        gap: 8px !important;
    }
    
    .gcard {
        min-height: 190px !important;
        max-height: 200px !important;
    }
    
    .offline-device-card {
        min-height: 220px !important;
        max-height: 240px !important;
    }
    
    .right-panel #Loc-Count-chart {
        height: 180px !important;
        min-height: 180px !important;
        max-height: 180px !important;
    }
}

/* Large desktop optimizations */
@media (min-width: 1440px) {
    .graphs-grid.dashboard-layout {
        grid-template-columns: 1fr 2fr;
    }
    
    .gcard {
        min-height: 200px !important;
        max-height: 220px !important;
    }
    
    .offline-device-card {
        min-height: 240px !important;
        max-height: 260px !important;
    }
}

/* Mobile adjustments (just in case) */
@media (max-width: 1023px) {
    .graphs-section {
        height: auto;
        min-height: 100vh;
        max-height: none;
        overflow-y: auto !important;
    }
}