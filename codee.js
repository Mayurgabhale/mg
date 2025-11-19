Premium Map UI Design with Dotted Lines

I'll create an attractive, premium map UI with dotted lines connecting multiple offices in the same location while keeping your existing map functionality intact.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Global Device Monitoring Dashboard</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap">
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js"></script>
    <style>
        :root {
            --primary: #0f172a;
            --secondary: #1e293b;
            --accent: #3b82f6;
            --accent-light: #60a5fa;
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
            --light: #f8fafc;
            --dark: #0f172a;
            --border: #e2e8f0;
            --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            --radius: 12px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
            color: var(--dark);
            line-height: 1.6;
            overflow-x: hidden;
            padding: 20px;
        }

        .dashboard-container {
            display: flex;
            gap: 20px;
            max-width: 1800px;
            margin: 0 auto;
        }

        /* Main Map Area */
        .map-section {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .map-card {
            background: white;
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            overflow: hidden;
            padding: 16px;
        }

        #realmap {
            height: 680px;
            width: 100%;
            border-radius: 10px;
        }

        .map-controls-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid var(--border);
        }

        .legend {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }

        .legend-item {
            display: flex;
            gap: 6px;
            align-items: center;
            background: var(--light);
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 13px;
        }

        .legend-color {
            width: 14px;
            height: 14px;
            border-radius: 3px;
        }

        .map-buttons {
            display: flex;
            gap: 8px;
        }

        .btn {
            padding: 8px 16px;
            border-radius: 8px;
            border: none;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
        }

        .btn-primary {
            background: var(--accent);
            color: white;
        }

        .btn-secondary {
            background: var(--light);
            color: var(--dark);
            border: 1px solid var(--border);
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .btn-primary:hover {
            background: var(--accent-light);
        }

        /* Side Panel */
        .side-panel {
            width: 360px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .panel-card {
            background: white;
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            overflow: hidden;
        }

        .panel-header {
            padding: 16px 20px;
            border-bottom: 1px solid var(--border);
            background: var(--primary);
            color: white;
        }

        .panel-header h3 {
            font-size: 16px;
            font-weight: 600;
        }

        .panel-content {
            padding: 20px;
            max-height: 400px;
            overflow-y: auto;
        }

        .city-item {
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 1px solid transparent;
        }

        .city-item:hover {
            background: var(--light);
            border-color: var(--border);
        }

        .city-item.active {
            background: #eff6ff;
            border-color: var(--accent);
        }

        .city-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
        }

        .city-name {
            font-weight: 600;
            font-size: 15px;
        }

        .city-region {
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 20px;
            background: var(--light);
            color: var(--dark);
        }

        .city-stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            font-size: 13px;
            color: #64748b;
        }

        .device-count {
            display: flex;
            justify-content: space-between;
        }

        .device-type {
            font-weight: 500;
        }

        /* Filters */
        .filter-group {
            margin-bottom: 16px;
        }

        .filter-group label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 500;
        }

        .filter-select {
            width: 100%;
            padding: 10px;
            border-radius: 8px;
            border: 1px solid var(--border);
            background: white;
            font-family: 'Inter', sans-serif;
        }

        .filter-actions {
            display: flex;
            gap: 10px;
        }

        /* Status Indicator */
        .status-indicator {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 12px;
            padding: 10px;
            background: var(--light);
            border-radius: 8px;
        }

        .pulse-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: var(--success);
            position: relative;
        }

        .pulse-dot::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: var(--success);
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% {
                transform: scale(1);
                opacity: 1;
            }
            70% {
                transform: scale(2.5);
                opacity: 0;
            }
            100% {
                transform: scale(1);
                opacity: 0;
            }
        }

        .status-online {
            color: var(--success);
            font-weight: 500;
        }

        /* Dotted Line Styling */
        .city-dotted-path {
            stroke-dasharray: 5, 5;
            stroke-width: 2;
            stroke: #ffaa00;
            fill: none;
            opacity: 0.7;
        }

        /* Enhanced City Label */
        .city-label-box {
            background: rgba(15, 23, 42, 0.9);
            padding: 10px 14px;
            border-radius: 10px;
            color: #00ff99;
            font-size: 13px;
            border: 1px solid #00ff99;
            box-shadow: 0 0 15px rgba(0, 255, 120, 0.4);
            backdrop-filter: blur(5px);
        }

        /* Multiple Office Indicators */
        .office-cluster {
            position: relative;
        }

        .office-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #ff6b6b;
            position: absolute;
            animation: float 3s infinite ease-in-out;
        }

        .office-dot:nth-child(1) { top: -5px; left: -5px; animation-delay: 0s; }
        .office-dot:nth-child(2) { top: -5px; right: -5px; animation-delay: 0.5s; }
        .office-dot:nth-child(3) { bottom: -5px; left: -5px; animation-delay: 1s; }
        .office-dot:nth-child(4) { bottom: -5px; right: -5px; animation-delay: 1.5s; }

        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }

        /* Responsive Adjustments */
        @media (max-width: 1200px) {
            .dashboard-container {
                flex-direction: column;
            }
            
            .side-panel {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <div class="map-section">
            <div class="map-card">
                <div id="realmap"></div>
                
                <div class="map-controls-bar">
                    <div class="legend">
                        <div class="legend-item">
                            <div class="legend-color" style="background: #10b981;"></div>
                            <span>Camera</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background: #f97316;"></div>
                            <span>Controller</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background: #7c3aed;"></div>
                            <span>Server</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background: #2563eb;"></div>
                            <span>Archiver</span>
                        </div>
                    </div>
                    
                    <div class="map-buttons">
                        <button id="toggle-heat" class="btn btn-secondary">
                            <span>Toggle Heat</span>
                        </button>
                        <button id="fit-all" class="btn btn-secondary">
                            <span>Fit All</span>
                        </button>
                        <button id="show-global" class="btn btn-primary">
                            <span>Global View</span>
                        </button>
                    </div>
                </div>
                
                <div class="status-indicator">
                    <div class="pulse-dot"></div>
                    <span class="status-online">All systems operational</span>
                </div>
            </div>
        </div>
        
        <div class="side-panel">
            <div class="panel-card">
                <div class="panel-header">
                    <h3>Global Device Locations</h3>
                </div>
                <div class="panel-content" id="region-panel-content">
                    <!-- Content will be populated by JavaScript -->
                </div>
            </div>
            
            <div class="panel-card">
                <div class="panel-header">
                    <h3>Filters & Controls</h3>
                </div>
                <div class="panel-content">
                    <div class="filter-group">
                        <label for="filter-type">Device Type</label>
                        <select id="filter-type" class="filter-select">
                            <option value="all">All device types</option>
                            <option value="camera">Camera</option>
                            <option value="controller">Controller</option>
                            <option value="server">Server</option>
                            <option value="archiver">Archiver</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label for="filter-status">Status</label>
                        <select id="filter-status" class="filter-select">
                            <option value="all">All Status</option>
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                        </select>
                    </div>
                    
                    <div class="filter-actions">
                        <button id="apply-filters" class="btn btn-primary" style="flex: 1;">Apply Filters</button>
                        <button id="reset-filters" class="btn btn-secondary" style="flex: 1;">Reset</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // City definitions
        const CITY_LIST = [
            {
                city: "Pune",
                lat: 18.5204,
                lon: 73.8567,
                region: "APAC",
                devices: {
                    camera: 60,
                    controller: 40,
                    server: 2,
                    archiver: 20
                },
                // Multiple office locations in the same city
                offices: [
                    { lat: 18.5204, lon: 73.8567, name: "Main Office" },
                    { lat: 18.5304, lon: 73.8667, name: "Tech Park" },
                    { lat: 18.5104, lon: 73.8467, name: "Data Center" }
                ]
            },
            {
                city: "Hyderabad",
                lat: 17.3850,
                lon: 78.4867,
                region: "APAC",
                devices: {
                    camera: 40,
                    controller: 28,
                    server: 10,
                    archiver: 20
                },
                offices: [
                    { lat: 17.3850, lon: 78.4867, name: "HQ" },
                    { lat: 17.3950, lon: 78.4967, name: "Cyber Tower" }
                ]
            },
            {
                city: "London",
                lat: 51.5074,
                lon: -0.1278,
                region: "EMEA",
                devices: {
                    camera: 22,
                    controller: 14,
                    server: 5,
                    archiver: 10
                },
                offices: [
                    { lat: 51.5074, lon: -0.1278, name: "Central" },
                    { lat: 51.5174, lon: -0.1178, name: "West End" }
                ]
            },
            {
                city: "New York",
                lat: 40.7128,
                lon: -74.0060,
                region: "NAMER",
                devices: {
                    camera: 35,
                    controller: 20,
                    server: 15,
                    archiver: 12
                },
                offices: [
                    { lat: 40.7128, lon: -74.0060, name: "Manhattan" },
                    { lat: 40.7228, lon: -74.0160, name: "Financial District" },
                    { lat: 40.7028, lon: -73.9960, name: "Brooklyn" }
                ]
            },
            {
                city: "Sao Paulo",
                lat: -23.5505,
                lon: -46.6333,
                region: "LACA",
                devices: {
                    camera: 18,
                    controller: 12,
                    server: 5,
                    archiver: 6
                },
                offices: [
                    { lat: -23.5505, lon: -46.6333, name: "Main Office" }
                ]
            }
        ];

        // Region colors
        const regionColors = {
            APAC: "#0ea5e9",
            EMEA: "#34d399",
            NAMER: "#fb923c",
            LACA: "#a78bfa"
        };

        // Map variables
        let realMap;
        let cityMarkers = [];
        let heatLayer = null;
        let officeMarkers = [];
        let dottedLines = [];

        // Initialize the map
        function initRealMap() {
            realMap = L.map("realmap", { preferCanvas: true }).setView([20, 0], 2);

            L.tileLayer(
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                { maxZoom: 20 }
            ).addTo(realMap);

            renderCitySummary();
            populateGlobalCityList();
            drawRegionBadges();
            drawHeatmap();
            drawMultipleOffices();

            L.control.scale().addTo(realMap);
        }

        // Render city markers with premium design
        function renderCitySummary() {
            // Clear existing markers
            cityMarkers.forEach(m => realMap.removeLayer(m));
            cityMarkers = [];

            CITY_LIST.forEach(c => {
                const total = c.devices.camera + c.devices.controller + c.devices.server + c.devices.archiver;
                
                // Create premium marker HTML
                const html = `
                    <div class="office-cluster" style="position:relative;">
                        <div style="
                            background:${regionColors[c.region]};
                            width: 20px;
                            height: 20px;
                            border-radius: 50%;
                            border: 3px solid white;
                            box-shadow: 0 0 0 3px ${regionColors[c.region]}, 0 0 20px rgba(0,0,0,0.3);
                        "></div>
                        <div class="office-dot"></div>
                        <div class="office-dot"></div>
                        <div class="office-dot"></div>
                        <div class="office-dot"></div>
                    </div>
                `;

                const icon = L.divIcon({
                    html,
                    className: "office-cluster-marker",
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                });

                const marker = L.marker([c.lat, c.lon], { icon }).addTo(realMap);
                cityMarkers.push(marker);

                // Add click event to zoom to city
                marker.on("click", () => {
                    realMap.setView([c.lat, c.lon], 10);
                    populateCityPanel(c.city);
                    highlightCityItem(c.city);
                    drawCityHighlight(c);
                });
            });

            fitAllCities();
        }

        // Draw multiple offices with dotted connections
        function drawMultipleOffices() {
            // Clear existing office markers and lines
            officeMarkers.forEach(m => realMap.removeLayer(m));
            officeMarkers = [];
            dottedLines.forEach(l => realMap.removeLayer(l));
            dottedLines = [];

            CITY_LIST.forEach(city => {
                if (city.offices && city.offices.length > 1) {
                    // Draw dotted lines connecting offices
                    const officeCoords = city.offices.map(office => [office.lat, office.lon]);
                    
                    // Create a convex hull or simple polygon to connect offices
                    const polygon = L.polyline(officeCoords, {
                        color: regionColors[city.region],
                        weight: 2,
                        o