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
        }

        .dashboard {
            display: flex;
            min-height: 100vh;
            padding: 20px;
            gap: 20px;
        }

        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .map-container {
            background: white;
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            overflow: hidden;
            position: relative;
            flex: 1;
        }

        #realmap {
            height: 100%;
            width: 100%;
            border-radius: var(--radius);
        }

        .map-overlay {
            position: absolute;
            top: 20px;
            left: 20px;
            z-index: 1000;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: var(--radius);
            padding: 16px;
            box-shadow: var(--shadow);
            width: 300px;
        }

        .map-overlay h2 {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 12px;
            color: var(--primary);
        }

        .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 16px;
        }

        .stat-card {
            background: var(--light);
            padding: 12px;
            border-radius: 8px;
            text-align: center;
        }

        .stat-value {
            font-size: 20px;
            font-weight: 700;
            color: var(--primary);
        }

        .stat-label {
            font-size: 12px;
            color: #64748b;
            margin-top: 4px;
        }

        .map-controls {
            display: flex;
            gap: 8px;
            margin-top: 12px;
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

        .sidebar {
            width: 350px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .panel {
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

        .filters {
            padding: 20px;
        }

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

        .legend {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 16px;
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
        }

        .legend-color {
            width: 16px;
            height: 16px;
            border-radius: 4px;
        }

        .region-badge {
            position: absolute;
            z-index: 800;
            padding: 8px 12px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            font-size: 13px;
            box-shadow: var(--shadow);
            backdrop-filter: blur(4px);
            background: rgba(0, 0, 0, 0.7);
        }

        .city-marker {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 10px;
            padding: 12px;
            box-shadow: var(--shadow);
            min-width: 180px;
            border-left: 4px solid var(--accent);
        }

        .city-marker h4 {
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 6px;
            color: var(--primary);
        }

        .city-marker-stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 4px;
            font-size: 12px;
        }

        .city-marker-stat {
            display: flex;
            justify-content: space-between;
        }

        .pulse-dot {
            width: 12px;
            height: 12px;
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

        .status-indicator {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
        }

        .status-online {
            color: var(--success);
        }

        .status-offline {
            color: var(--danger);
        }

        /* Responsive adjustments */
        @media (max-width: 1200px) {
            .dashboard {
                flex-direction: column;
            }
            
            .sidebar {
                width: 100%;
            }
            
            .map-overlay {
                position: relative;
                top: 0;
                left: 0;
                width: 100%;
                margin-bottom: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="main-content">
            <div class="map-container">
                <div id="realmap"></div>
                
                <div class="map-overlay">
                    <h2>Global Device Monitoring</h2>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-value">175</div>
                            <div class="stat-label">Cameras</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">114</div>
                            <div class="stat-label">Controllers</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">37</div>
                            <div class="stat-label">Servers</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">68</div>
                            <div class="stat-label">Archivers</div>
                        </div>
                    </div>
                    
                    <div class="status-indicator">
                        <div class="pulse-dot"></div>
                        <span class="status-online">All systems operational</span>
                    </div>
                    
                    <div class="map-controls">
                        <button id="toggle-heat" class="btn btn-secondary">
                            <span>Heat Map</span>
                        </button>
                        <button id="fit-all" class="btn btn-secondary">
                            <span>Fit All</span>
                        </button>
                        <button id="show-global" class="btn btn-primary">
                            <span>Global View</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="sidebar">
            <div class="panel">
                <div class="panel-header">
                    <h3>Device Locations</h3>
                </div>
                <div class="panel-content" id="region-panel-content">
                    <!-- Content will be populated by JavaScript -->
                </div>
            </div>
            
            <div class="panel">
                <div class="panel-header">
                    <h3>Filters</h3>
                </div>
                <div class="filters">
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
                    
                    <div class="filter-actions map-controls">
                        <button id="apply-filters" class="btn btn-primary">Apply Filters</button>
                        <button id="reset-filters" class="btn btn-secondary">Reset</button>
                    </div>
                    
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
                            <div class="legend-color" style="background: #3b82f6;"></div>
                            <span>Archiver</span>
                        </div>
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
                }
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
                }
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
                }
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
                }
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
                }
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

        // Initialize the map
        function initRealMap() {
            // Create map with a more premium tile layer
            realMap = L.map("realmap", { 
                preferCanvas: true,
                zoomControl: false
            }).setView([20, 0], 2);

            // Add a premium tile layer
            L.tileLayer(
                "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                maxZoom: 20,
                subdomains: 'abcd'
            }).addTo(realMap);

            // Add custom zoom control
            L.control.zoom({
                position: 'bottomright'
            }).addTo(realMap);

            // Initialize components
            renderCitySummary();
            populateGlobalCityList();
            drawRegionBadges();
            drawHeatmap();

            // Add scale control
            L.control.scale({
                imperial: false,
                position: 'bottomleft'
            }).addTo(realMap);
        }

        // Render city markers with premium design
        function renderCitySummary() {
            // Clear existing markers
            cityMarkers.forEach(m => realMap.removeLayer(m));
            cityMarkers = [];

            CITY_LIST.forEach(c => {
                const total = c.devices.camera + c.devices.controller + c.devices.server + c.devices.archiver;
                
                // Create custom HTML for marker
                const html = `
                    <div class="city-marker">
                        <h4>${c.city}</h4>
                        <div class="city-marker-stats">
                            <div class="city-marker-stat">
                                <span>Cameras:</span>
                                <span>${c.devices.camera}</span>
                            </div>
                            <div class="city-marker-stat">
                                <span>Controllers:</span>
                                <span>${c.devices.controller}</span>
                            </div>
                            <div class="city-marker-stat">
                                <span>Servers:</span>
                                <span>${c.devices.server}</span>
                            </div>
                            <div class="city-marker-stat">
                                <span>Archivers:</span>
                                <span>${c.devices.archiver}</span>
                            </div>
                        </div>
                    </div>
                `;

                const icon = L.divIcon({
                    html,
                    className: "city-marker-icon",
                    iconSize: [180, 100],
                    iconAnchor: [90, 50]
                });

                const marker = L.marker([c.lat, c.lon], { icon }).addTo(realMap);
                cityMarkers.push(marker);

                // Add click event to zoom to city
                marker.on("click", () => {
                    realMap.setView([c.lat, c.lon], 8);
                    populateCityPanel(c.city);
                    highlightCityItem(c.city);
                });
   