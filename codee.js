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

    /* Chart Colors for Dark Theme */
    --chart-camera-color: #ff4d4d;
    --chart-archiver-color: #4da6ff;
    --chart-controller-color: #ffaa00;
    --chart-ccure-color: #7d3cff;
    --chart-grid-color: rgba(255, 255, 255, 0.1);
    --chart-text-color: #e6eef7;
    --chart-bg-color: #0a0a0a;
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

    /* Chart Colors for Light Theme */
    --chart-camera-color: #dc2626;
    --chart-archiver-color: #2563eb;
    --chart-controller-color: #d97706;
    --chart-ccure-color: #7c3aed;
    --chart-grid-color: rgba(0, 0, 0, 0.1);
    --chart-text-color: #1e293b;
    --chart-bg-color: #ffffff;
}

/* Overall section - FIXED THEME SUPPORT */
.graphs-section {
    background: var(--graph-bg-dark);
    color: var(--graph-text-dark);
    padding: 20px 15px 40px;
    border-radius: 12px;
    font-family: 'Poppins', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    box-shadow: 0 6px 24px var(--graph-shadow-dark);
    height: 100vh;
    min-height: 100vh;
    max-height: 100vh;
    width: 100%;
    overflow-x: hidden;
    box-sizing: border-box;
}

.theme-light .graphs-section {
    background: var(--graph-bg-light);
    color: var(--graph-text-light);
    box-shadow: 0 6px 24px var(--graph-shadow-light);
}

/* Card title - FIXED THEME SUPPORT */
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

/* Offline Device Graph Card - FIXED THEME SUPPORT */
.offline-device-card {
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
    min-height: 220px;
    grid-column: 1 / -1;
}

.theme-light .offline-device-card {
    background: var(--graph-card-bg-light);
    border: 1px solid var(--graph-card-border-light);
}

.offline-device-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px var(--graph-shadow-dark);
}

.theme-light .offline-device-card:hover {
    box-shadow: 0 8px 25px var(--graph-shadow-light);
}

/* Card title specific for offline device - FIXED THEME SUPPORT */
.offline-device-card .gcard-title {
    font-size: clamp(14px, 2.5vw, 16px);
    color: var(--graph-card-title-dark);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 5px;
}

.theme-light .offline-device-card .gcard-title {
    color: var(--graph-card-title-light);
}

/* Canvas container for offline device chart */
.offline-device-card .chart-container {
    width: 100%;
    height: 100%;
    min-height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

/* Canvas element styling - FIXED THEME SUPPORT */
#DotOfflineDevice {
    width: 100% !important;
    height: 100% !important;
    max-height: 220px;
    box-sizing: border-box;
    background: var(--chart-bg-color) !important;
}

.theme-light #DotOfflineDevice {
    background: var(--chart-bg-color) !important;
}