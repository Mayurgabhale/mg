:root {
    /* Dark Theme (Default) */
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --bg-card: #1a1d29;
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --text-accent: #7c3aed;
    --border-color: #334155;
    --shadow: rgba(0, 0, 0, 0.3);
    --success: #10b981;
    --warning: #f59e0b;
    --danger: #ef4444;
    --chart-bg: #0a0a0a;
}

.theme-light {
    /* Light Theme */
    --bg-primary: #f8fafc;
    --bg-secondary: #ffffff;
    --bg-card: #ffffff;
    --text-primary: #1e293b;
    --text-secondary: #64748b;
    --text-accent: #7c3aed;
    --border-color: #e2e8f0;
    --shadow: rgba(0, 0, 0, 0.1);
    --success: #059669;
    --warning: #d97706;
    --danger: #dc2626;
    --chart-bg: #f1f5f9;
}

/* WORLD MAP WRAPPER - FLEX FIX */
.worldmap-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: flex-start;
    box-sizing: border-box;
}

/* MAIN MAP CARD */
.worldmap-card {
    width: 100%;
    background: var(--bg-card);
    box-shadow: 0 6px 20px var(--shadow);
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
}

#realmap {
    height: 400px;
    width: 100%;
    box-sizing: border-box;
}

/* BOTTOM ROW UNDER MAP */
.map-bottom-bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    background: var(--bg-card);
    color: var(--text-primary);
    padding: 12px 15px;
    gap: 15px;
    box-sizing: border-box;
    width: 100%;
}

/* LEGEND */
.legend {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
}

.legend-item {
    display: flex;
    align-items: center;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    font-size: clamp(10px, 2vw, 12px);
    color: var(--text-primary);
    padding: 4px 8px;
    border-radius: 4px;
    white-space: nowrap;
}

.legend-item i {
    margin-right: 4px;
    font-size: clamp(10px, 2vw, 12px);
}

.legend-box {
    width: 10px;
    height: 10px;
    background: var(--bg-secondary);
    color: var(--text-primary);
}

/* CONTROL BUTTONS */
.map-controls {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.map-controls button {
    padding: 6px 12px;
    font-size: clamp(10px, 2vw, 12px);
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid var(--border-color);
    background: var(--bg-primary);
    color: var(--text-primary);
    transition: all 0.3s ease;
    white-space: nowrap;
}

.map-controls button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
}

.map-controls .btn-ghost {
    background: transparent;
    border: 1px solid var(--border-color);
    font-weight: 600;
    color: var(--text-primary);
}

.map-controls .btn-gv {
    background-color: var(--bg-primary);
    color: var(--text-primary);
}

/* RIGHT PANEL */
.region-panel {
    display: none;
    width: 90%;
    max-width: 300px;
    background: var(--bg-card);
    font-size: clamp(10px, 2vw, 12px);
    padding: 12px;
    box-shadow: 0 6px 20px var(--shadow);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    position: absolute;
    top: 70px;
    right: 5%;
    z-index: 9999;
    border-radius: 8px;
    box-sizing: border-box;
    max-height: 80vh;
    overflow-y: auto;
}

.panel-title {
    font-size: clamp(12px, 2.5vw, 14px);
    font-weight: 700;
    margin-bottom: 10px;
    white-space: normal;
    color: var(--text-primary);
    line-height: 1.3;
}

.panel-content {
    max-height: 340px;
    overflow-y: auto;
    margin-bottom: 15px;
    word-wrap: break-word;
}

/* FILTER SECTION */
.filter-block {
    border-top: 1px solid var(--border-color);
    padding-top: 12px;
    margin-top: 12px;
}

.filter-select {
    width: 100%;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid var(--border-color);
    margin-bottom: 10px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: clamp(10px, 2vw, 12px);
    box-sizing: border-box;
}

.filter-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.filter-actions button {
    flex: 1;
    min-width: 80px;
    padding: 6px 10px;
    font-size: clamp(10px, 2vw, 12px);
}

/* PIN BASE */
.city-marker .pin {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: clamp(22px, 6vw, 27px);
    height: clamp(22px, 6vw, 27px);
    border-radius: 50%;
    color: #fff;
    font-size: clamp(14px, 4vw, 18px);
    transition: transform 120ms ease, opacity 120ms ease;
}

/* DEFAULT ICON COLOR */
.city-marker .pin i {
    color: #ffd;
    transform-origin: center;
    font-size: clamp(16px, 5vw, 25px);
}

/* BLINKING BEHAVIOUR */
.city-marker .pin.blink {
    animation: city-pin-blink 1.0s infinite ease-in-out;
}

/* CHANGE COLOR WHEN BLINKING (MORE VISIBLE) */
.city-marker .pin.blink i {
    color: #ff3b3b;
    text-shadow: 0 0 6px rgba(255, 59, 59, 0.9);
}

/* KEYFRAMES */
@keyframes city-pin-blink {
    0% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.25;
        transform: scale(1.12);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

/* OPTIONALLY ADD SEVERITY STYLES */
.city-marker .pin.blink-high i {
    color: #ff0000;
}

.city-label-box {
    background: rgba(0, 0, 0, 0.75);
    padding: 6px 10px;
    border-radius: 6px;
    color: #00ff99;
    font-size: clamp(11px, 3vw, 13px);
    border: 1px solid #00ff99;
    box-shadow: 0 0 8px rgba(0, 255, 120, 0.5);
}

.city-dotted-path {
    color: #ffaa00;
    weight: 2;
    dashArray: "4 6";
}

/* CONTAINER */
.container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px;
    align-items: flex-start;
    box-sizing: border-box;
    width: 100%;
}

.map-card {
    width: 100%;
    background: var(--bg-card);
    border-radius: 10px;
    padding: 12px;
    box-shadow: 0 6px 20px var(--shadow);
    border: 1px solid var(--border-color);
    box-sizing: border-box;
}

.panel {
    width: 100%;
    background: var(--bg-card);
    border-radius: 10px;
    padding: 12px;
    box-shadow: 0 6px 20px var(--shadow);
    overflow: auto;
    max-height: 500px;
    border: 1px solid var(--border-color);
    box-sizing: border-box;
}

.dev-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: clamp(30px, 8vw, 36px);
    height: clamp(30px, 8vw, 36px);
    border-radius: 8px;
    color: #fff;
}

.dev-glow {
    box-shadow: 0 0 10px 3px rgba(0, 200, 0, 0.22);
}

.dev-glow-off {
    box-shadow: 0 0 10px 3px rgba(200, 0, 0, 0.14);
    opacity: 0.95;
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(0, 200, 0, 0.30);
    }
    70% {
        box-shadow: 0 0 0 12px rgba(0, 200, 0, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(0, 200, 0, 0);
    }
}

.pulse {
    animation: pulse 2s infinite;
    border-radius: 50%;
}

.region-label {
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    padding: 6px 8px;
    border-radius: 6px;
    font-weight: 700;
    font-size: clamp(11px, 3vw, 13px);
}

.stat-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid var(--border-color);
    font-size: clamp(11px, 3vw, 13px);
}

.badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 999px;
    font-weight: 700;
    font-size: clamp(11px, 3vw, 13px);
}

.badge-apac {
    background: #0ea5e9;
    color: #fff;
}

.badge-emea {
    background: #34d399;
    color: #fff;
}

.badge-namer {
    background: #fb923c;
    color: #fff;
}

.badge-laca {
    background: #a78bfa;
    color: #fff;
}

.legend {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 8px;
}

.controls {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
}

.city-list {
    margin-top: 8px;
    max-height: 380px;
    overflow: auto;
}

.city-item {
    padding: 8px 10px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid var(--border-color);
    margin-bottom: 6px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: clamp(11px, 3vw, 13px);
    transition: all 0.2s ease;
}

.city-item:hover {
    background: var(--bg-primary);
    transform: translateX(2px);
}

.small-muted {
    color: var(--text-secondary);
    font-size: clamp(9px, 2vw, 11px);
}

/* LEAFLET POPUP STYLES */
.leaflet-popup-content-wrapper {
    background: var(--bg-card, #fff);
    color: var(--text-primary, #111);
    border-radius: 8px;
    padding: 8px 10px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    font-size: clamp(11px, 3vw, 13px);
}

.city-summary-tooltip {
    background: rgba(0, 0, 0, 0.85) !important;
    color: #fff !important;
    border: none !important;
    padding: 8px 10px !important;
    border-radius: 6px !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35) !important;
    font-size: clamp(11px, 3vw, 13px) !important;
    line-height: 1.2 !important;
    width: auto !important;
    max-width: 260px !important;
}

.leaflet-control-attribution {
    display: none !important;
}

/* CHART STYLES */
#cityBarChart {
    width: 100% !important;
    height: 300px !important;
    box-sizing: border-box;
}

/* FULLSCREEN MODE */
.worldmap-card.fullscreen {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    z-index: 99999;
    background: var(--bg-primary);
}

/* RESIZE THE MAP CONTAINER TO FILL PARENT */
.worldmap-card.fullscreen #realmap {
    width: 100% !important;
    height: 100% !important;
}

/* KEEP BOTTOM BAR VISIBLE */
.worldmap-card.fullscreen .map-bottom-bar {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 99999;
}

/* FULLSCREEN BUTTON (TOP RIGHT) */
.map-fullscreen-btn,
.map-CityOverview-btn {
    position: absolute;
    top: 10px;
    right: 12px;
    z-index: 9999;
    padding: 8px 12px;
    font-size: clamp(10px, 2vw, 12px);
    border: 1px solid var(--border-color);
    background: var(--bg-primary);
    color: var(--text-primary);
    cursor: pointer;
    border-radius: 4px;
    transition: 0.3s ease;
    white-space: nowrap;
}

.map-CityOverview-btn {
    top: 50px;
}

.map-fullscreen-btn:hover,
.map-CityOverview-btn:hover {
    background: var(--bg-secondary);
    transform: translateY(-1px);
}

/* RESPONSIVE DESIGN FOR MAP */
/* Tablets and larger phones */
@media (min-width: 768px) {
    .worldmap-wrapper {
        flex-direction: row;
    }
    
    #realmap {
        height: 500px;
    }
    
    .map-bottom-bar {
        padding: 15px 20px;
    }
    
    .region-panel {
        width: 300px;
        right: 20px;
    }
    
    .container {
        flex-direction: row;
    }
    
    .map-card {
        min-width: auto;
        flex: 1;
    }
    
    .panel {
        width: 300px;
        max-height: 600px;
    }
}

/* Desktop and larger tablets */
@media (min-width: 1024px) {
    #realmap {
        height: 550px;
    }
    
    .map-bottom-bar {
        padding: 15px 25px;
    }
    
    .region-panel {
        right: 25px;
    }
}

/* Large desktops */
@media (min-width: 1440px) {
    #realmap {
        height: 600px;
    }
}

/* Mobile devices */
@media (max-width: 767px) {
    .map-bottom-bar {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
        padding: 10px 12px;
    }
    
    .map-controls {
        width: 100%;
        justify-content: space-between;
    }
    
    .map-controls button {
        flex: 1;
        text-align: center;
        min-width: 100px;
    }
    
    .region-panel {
        width: 90%;
        right: 5%;
        top: 60px;
    }
    
    #realmap {
        height: 350px;
    }
}

/* Small mobile devices */
@media (max-width: 480px) {
    .map-bottom-bar {
        padding: 8px 10px;
        gap: 12px;
    }
    
    .legend {
        justify-content: center;
        width: 100%;
    }
    
    .map-controls {
        flex-direction: column;
        width: 100%;
        gap: 5px;
    }
    
    .map-controls button {
        width: 100%;
        margin-bottom: 5px;
    }
    
    .region-panel {
        width: 95%;
        right: 2.5%;
        top: 50px;
        padding: 10px;
    }
    
    #realmap {
        height: 300px;
    }
    
    .map-fullscreen-btn,
    .map-CityOverview-btn {
        padding: 6px 10px;
        font-size: 10px;
    }
    
    .map-CityOverview-btn {
        top: 45px;
    }
}

/* Extra small devices */
@media (max-width: 360px) {
    #realmap {
        height: 250px;
    }
    
    .legend-item {
        font-size: 9px;
        padding: 3px 6px;
    }
    
    .map-controls button {
        font-size: 9px;
        padding: 5px 8px;
    }
    
    .region-panel {
        top: 45px;
    }
}