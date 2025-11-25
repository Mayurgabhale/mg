/* Update these specific sections in your CSS */

/* Main grid layout - Responsive */
.graphs-grid.dashboard-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
    align-items: start;
    grid-auto-rows: minmax(0, 1fr); /* Changed from auto */
    width: 100%;
    box-sizing: border-box;
    height: calc(100vh - 60px); /* Account for padding */
    overflow: hidden;
}

/* Left area is its own grid to form cards */
.left-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    grid-template-rows: repeat(3, minmax(0, 1fr)); /* 3 rows for 6 items */
    gap: 8px;
    width: 100%;
    box-sizing: border-box;
    height: 100%;
    max-height: 100%;
    overflow: hidden;
}

/* General card - Reduced heights */
.gcard {
    background: var(--graph-card-bg-dark);
    border: 1px solid var(--graph-card-border-dark);
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
    transition: all 0.3s ease;
    border-radius: 8px;
    width: 100%;
    box-sizing: border-box;
    min-height: 160px; /* Reduced from 200px */
    max-height: 180px; /* Added max-height */
    height: 100%;
}

/* Semi-donut - Reduced size */
.semi-donut {
    --percentage: 0;
    --active: var(--graph-gauge-active);
    --inactive: var(--graph-gauge-inactive);
    width: 100%;
    max-width: 250px; /* Reduced from 300px */
    height: 120px; /* Reduced from 150px */
    position: relative;
    font-size: clamp(14px, 3vw, 18px); /* Reduced font size */
    font-weight: 600;
    overflow: hidden;
    color: var(--active);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    box-sizing: border-box;
    margin: 0 auto;
}

/* Semi-donut after - Reduced size */
.semi-donut::after {
    content: '';
    width: 100%;
    height: 200%;
    max-width: 250px; /* Reduced from 300px */
    max-height: 250px; /* Reduced from 300px */
    border: 40px solid; /* Reduced from 50px */
    border-color: var(--inactive) var(--inactive) var(--active) var(--active);
    position: absolute;
    border-radius: 50%;
    left: 0;
    top: 0;
    transform: rotate(calc(-45deg + var(--percentage) * 1.8deg));
    animation: fillAnimation 1s ease-in;
    box-sizing: border-box;
}

/* Gtext adjustments */
.gtext {
    position: absolute;
    bottom: 6px; /* Reduced from 8px */
    text-align: center;
    color: var(--graph-gauge-text);
    width: 100%;
    padding: 0 8px; /* Reduced from 10px */
    box-sizing: border-box;
}

.gtext .total {
    font-size: clamp(14px, 3vw, 18px); /* Reduced from 16-22px */
    color: var(--graph-gauge-total);
    display: block;
    line-height: 1.2;
}

.gtext small {
    font-size: clamp(9px, 2vw, 12px); /* Reduced from 10-14px */
    color: var(--graph-card-footer-dark);
    display: block;
    line-height: 1.3;
}

/* Offline Device Card - Reduced height */
.offline-device-card {
    background: var(--graph-card-bg-dark);
    border: 1px solid var(--graph-card-border-dark);
    padding: 12px; /* Reduced from 15px */
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
    transition: all 0.3s ease;
    border-radius: 8px;
    width: 100%;
    box-sizing: border-box;
    min-height: 200px; /* Reduced from 280px */
    max-height: 220px; /* Added max-height */
    grid-column: 1 / -1;
    height: 100%;
}

/* Offline device chart container */
.offline-device-card .chart-container {
    width: 100%;
    height: 100%;
    min-height: 150px; /* Reduced from 200px */
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

/* Offline device canvas */
#DotOfflineDevice {
    width: 100% !important;
    height: 100% !important;
    max-height: 180px; /* Reduced from 240px */
    box-sizing: border-box;
}

/* Remove the duplicate Total Count card styles */
.gcard.wide.gcard-pie.offline-device-card {
    display: none; /* Hide duplicate card */
}

/* Desktop and laptop specific optimizations */
@media (min-width: 1024px) {
    .graphs-grid.dashboard-layout {
        grid-template-columns: 1fr 1.8fr;
        gap: 15px;
        height: calc(100vh - 40px);
    }
    
    .left-grid {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(3, minmax(0, 1fr));
        gap: 8px;
    }
    
    .gcard {
        min-height: 170px;
        max-height: 190px;
    }
    
    .offline-device-card {
        min-height: 210px;
        max-height: 230px;
    }
    
    .semi-donut {
        max-width: 240px;
        height: 130px;
    }
}

/* Large desktop optimizations */
@media (min-width: 1440px) {
    .graphs-grid.dashboard-layout {
        grid-template-columns: 1fr 2fr;
    }
    
    .gcard {
        min-height: 180px;
        max-height: 200px;
    }
    
    .offline-device-card {
        min-height: 220px;
        max-height: 240px;
    }
    
    .semi-donut {
        max-width: 260px;
        height: 140px;
    }
}

/* Remove bottom row if empty */
.bottom-row:empty {
    display: none !important;
}

/* Ensure no overflow anywhere */
.graphs-section,
.graphs-inner,
.graphs-grid.dashboard-layout,
.left-grid {
    overflow: hidden !important;
}