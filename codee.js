/* Graph Section - Dark/Light Theme */
:root {
    /* Dark Theme Colors */
    --graph-bg-dark: #0a0a0a;
    --graph-text-dark: #e6eef7;
    --graph-title-dark: #2ef07f;
    --graph-card-bg-dark: linear-gradient(180deg, rgba(255, 255, 255, 0.099), rgba(255, 255, 255, 0.104));
    --graph-card-border-dark: rgba(255, 255, 255, 0.94);
    --graph-card-title-dark: #cfeeed;
    --graph-card-footer-dark: #98a3a8;
    --graph-map-bg-dark: #060606;
    --graph-map-text-dark: #b8f4c9;
    --graph-map-annot-bg-dark: rgba(0, 0, 0, 0.45);
    --graph-map-annot-border-dark: rgba(255, 255, 255, 0.04);
    --graph-gauge-active: #12b76a;
    --graph-gauge-inactive: #f6b43a;
    --graph-gauge-total: #0ee08f;
    --graph-gauge-text: #f6b43a;
    --graph-shadow-dark: rgba(0, 0, 0, 0.6);
}

.theme-light {
    /* Light Theme Colors */
    --graph-bg-light: #f8fafc;
    --graph-text-light: #1e293b;
    --graph-title-light: #059669;
    --graph-card-bg-light: linear-gradient(180deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.01));
    --graph-card-border-light: rgba(0, 0, 0, 0.08);
    --graph-card-title-light: #374151;
    --graph-card-footer-light: #6b7280;
    --graph-map-bg-light: #ffffff;
    --graph-map-text-light: #059669;
    --graph-map-annot-bg-light: rgba(0, 0, 0, 0.05);
    --graph-map-annot-border-light: rgba(0, 0, 0, 0.1);
    --graph-gauge-active: #10b981;
    --graph-gauge-inactive: #d97706;
    --graph-gauge-total: #059669;
    --graph-gauge-text: #d97706;
    --graph-shadow-light: rgba(0, 0, 0, 0.1);
}

/* Overall section */
.graphs-section {
    background: var(--graph-bg-dark);
    color: var(--graph-text-dark);
    padding: 20px 15px 40px;
    border-radius: 12px;
    font-family: 'Poppins', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    box-shadow: 0 6px 24px var(--graph-shadow-dark);
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
    box-sizing: border-box;
}

.theme-light .graphs-section {
    background: var(--graph-bg-light);
    color: var(--graph-text-light);
    box-shadow: 0 6px 24px var(--graph-shadow-light);
}

/* Header */
.graphs-title {
    color: var(--graph-title-dark);
    font-size: clamp(18px, 4vw, 24px);
    margin-bottom: 14px;
    letter-spacing: 2px;
    font-weight: 700;
    text-align: center;
}

.theme-light .graphs-title {
    color: var(--graph-title-light);
}

.graphs-inner {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    box-sizing: border-box;
}

/* Main grid layout - Responsive */
.graphs-grid.dashboard-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
    align-items: start;
    grid-auto-rows: auto;
    width: 100%;
    box-sizing: border-box;
}

/* Left area is its own grid to form cards */
.left-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 12px;
    width: 100%;
    box-sizing: border-box;
}

/* Right panel - World Map */
.right-panel {
    width: 100%;
    box-sizing: border-box;
}

.right-panel .gcard.tall {
    height: auto;
    display: flex;
    flex-direction: column;
}

/* Bottom row (spans full width below left + right) */
.bottom-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
    width: 100%;
    box-sizing: border-box;
}

/* General card */
.gcard {
    background: var(--graph-card-bg-dark);
    border: 1px solid var(--graph-card-border-dark);
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
    transition: all 0.3s ease;
    border-radius: 8px;
    width: 100%;
    box-sizing: border-box;
    min-height: 200px;
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
    font-size: clamp(12px, 2.5vw, 16px);
    color: var(--graph-card-title-dark);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 10px;
    line-height: 1.3;
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

/* Wide card adjustments */
.gcard.wide {
    width: 100% !important;
    height: auto !important;
    min-height: 280px;
}

/* Chart containers */
#Loc-Count-chart {
    width: 100%;
    position: relative;
    margin-top: 5px;
    box-sizing: border-box;
}

/* Placeholders for charts & map */
.map-placeholder {
    background: var(--graph-map-bg-dark);
    border-radius: 8px;
    height: 100%;
    min-height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 12px;
    position: relative;
    color: var(--graph-map-text-dark);
    font-weight: 600;
    box-sizing: border-box;
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
    border-radius: 8px;
    margin-top: 8px;
    background: var(--graph-map-bg-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--graph-map-text-dark);
    font-weight: 600;
    width: 100%;
    height: 100%;
    min-height: 200px;
    box-sizing: border-box;
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
    width: 100%;
    max-width: 300px;
    height: 150px;
    position: relative;
    font-size: clamp(16px, 4vw, 22px);
    font-weight: 600;
    overflow: hidden;
    color: var(--active);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    box-sizing: border-box;
    margin: 0 auto;
}

/* Half circle background + fill */
.semi-donut::after {
    content: '';
    width: 100%;
    height: 200%;
    max-width: 300px;
    max-height: 300px;
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
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
}

.gtext .total {
    font-size: clamp(16px, 4vw, 22px);
    color: var(--graph-gauge-total);
    display: block;
    line-height: 1.2;
}

.gtext small {
    font-size: clamp(10px, 2.5vw, 14px);
    color: var(--graph-card-footer-dark);
    display: block;
    line-height: 1.3;
}

.theme-light .gtext small {
    color: var(--graph-card-footer-light);
}

/* Canvas responsiveness */
.gcard.wide canvas {
    width: 100% !important;
    height: 100% !important;
    max-height: 280px;
    box-sizing: border-box;
}

.gcard-pie {
    background: var(--graph-card-bg-dark);
    border: 1px solid var(--graph-card-border-dark);
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
    transition: all 0.3s ease;
    width: 100%;
    box-sizing: border-box;
}

.theme-light .gcard-pie {
    background: var(--graph-card-bg-light);
    border: 1px solid var(--graph-card-border-light);
}

/* Device health table */
.device-health-card {
    height: 250px;
    overflow-y: auto;
}

#device-health-table {
    width: 100%;
    border-collapse: collapse;
    font-size: clamp(12px, 2vw, 14px);
}

#device-health-table th, #device-health-table td {
    padding: 8px;
    text-align: center;
    border-bottom: 1px solid var(--graph-card-border-dark);
}

.theme-light #device-health-table th,
.theme-light #device-health-table td {
    border-bottom: 1px solid var(--graph-card-border-light);
}

.trend-up { color: #10b981; }   /* green */
.trend-down { color: #ef4444; } /* red */

/* Failure count chart */
#failureCountChart {
    width: 100% !important;
    height: 100% !important;
    box-sizing: border-box;
}

/* Responsive Design */
/* Tablets and larger phones */
@media (min-width: 768px) {
    .graphs-grid.dashboard-layout {
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }
    
    .left-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .bottom-row {
        grid-column: 1 / -1;
        grid-template-columns: 1fr 2fr;
        gap: 20px;
    }
    
    .gcard.wide {
        min-height: 300px;
    }
}

/* Desktop and larger tablets */
@media (min-width: 1024px) {
    .graphs-grid.dashboard-layout {
        grid-template-columns: 1fr 1.5fr;
        gap: 25px;
    }
    
    .left-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
    }
    
    .bottom-row {
        grid-template-columns: 1fr 2fr;
        gap: 25px;
    }
    
    .gcard.wide {
        min-height: 320px;
    }
}

/* Large desktops */
@media (min-width: 1440px) {
    .graphs-grid.dashboard-layout {
        grid-template-columns: 1fr 2fr;
    }
    
    .left-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
    }
}

/* Mobile devices */
@media (max-width: 767px) {
    .graphs-section {
        padding: 15px 10px 30px;
    }
    
    .left-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }
    
    .semi-donut {
        max-width: 250px;
        height: 125px;
    }
    
    .semi-donut::after {
        border-width: 40px;
    }
    
    .gcard {
        padding: 12px;
        min-height: 180px;
    }
    
    .gcard.wide {
        min-height: 250px;
    }
}

/* Small mobile devices */
@media (max-width: 480px) {
    .graphs-section {
        padding: 12px 8px 20px;
    }
    
    .graphs-title {
        font-size: 18px;
        letter-spacing: 1px;
    }
    
    .semi-donut {
        max-width: 200px;
        height: 100px;
    }
    
    .semi-donut::after {
        border-width: 30px;
    }
    
    .gtext .total {
        font-size: 16px;
    }
    
    .gtext small {
        font-size: 10px;
    }
    
    .gcard {
        padding: 10px;
        min-height: 160px;
    }
    
    .gcard-title {
        font-size: 12px;
        margin-bottom: 8px;
    }
    
    .gcard.wide {
        min-height: 220px;
    }
}

/* Extra small devices */
@media (max-width: 360px) {
    .left-grid {
        grid-template-columns: 1fr;
        gap: 10px;
    }
    
    .semi-donut {
        max-width: 180px;
        height: 90px;
    }
    
    .semi-donut::after {
        border-width: 25px;
    }
    
    .gcard {
        min-height: 150px;
        padding: 8px;
    }
}