when id do light theme that time graph is not dipsly correct graph text is hide
    becaue graph backgroudn and text color are same ok
        dark them is correct but lught theme is not correct 
now i want only light theme color code wiht correct do disply the grah wiht perfect without hide any text ok 
    
<!-- Updated Offline Device Card with new class -->
              <div class="offline-device-card" >
                <h4 class="gcard-title">Offline Device</h4>
                <div class="chart-container">
                  <canvas id="DotOfflineDevice"></canvas>
                </div>
              </div>



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



/*  */
/* Offline Device Graph Card */
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
    /* Span full width in grid */
}

.totacl-gcard {
    background: var(--graph-card-bg-dark);
    border: 1px solid var(--graph-card-border-dark);
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
    transition: all 0.3s ease;
    border-radius: 8px;
    width: 100%;
    box-sizing: border-box;
    height: 240px;
    grid-column: 1 / -1;
    /* Span full width in grid */
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

/* Card title specific for offline device */
.offline-device-card .gcard-title {
    font-size: clamp(14px, 2.5vw, 16px);
     color: var(--graph-card-title-dark);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 5px;
    /* text-align: center; */
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

/* Canvas element styling */
#DotOfflineDevice {
    width: 100% !important;
    height: 100% !important;
    max-height: 220px;
    box-sizing: border-box;
     /* background: var(--chart-bg-color) !important; */
}
.theme-light #DotOfflineDevice {
    background: var(--chart-bg-color);
    /* color: var(--graph-card-title-light) !important; */
    color: black;
}
/* Responsive Design for Offline Device Card */
/* Tablets and larger phones */
@media (min-width: 768px) {
    .offline-device-card {
        grid-column: 1 / -1;
        min-height: 300px;
    }

    #DotOfflineDevice {
        max-height: 220px;
    }
}

/* Desktop and larger tablets */
@media (min-width: 1024px) {
    .offline-device-card {
        min-height: 260px;
    }

    #DotOfflineDevice {
        max-height: 220px;
    }
}

/* Mobile devices */
@media (max-width: 767px) {
    .offline-device-card {
        min-height: 250px;
        padding: 12px;
    }

    #DotOfflineDevice {
        max-height: 200px;
    }
}

/* Small mobile devices */
@media (max-width: 480px) {
    .offline-device-card {
        min-height: 220px;
        padding: 10px;
    }

    .offline-device-card .gcard-title {
        font-size: 13px;
        margin-bottom: 10px;
    }

    #DotOfflineDevice {
        max-height: 180px;
    }
}

/* Extra small devices */
@media (max-width: 360px) {
    .offline-device-card {
        min-height: 200px;
    }

    #DotOfflineDevice {
        max-height: 160px;
    }
}
// ========== GLOBALS ==========
let offlineChart;
let cityIndexMap = {};
let cityCounter = 0;
let dynamicTypeIndexMap = {};
let dynamicTypeList = [];

// ========== GET CHART COLORS BASED ON THEME ==========
function getChartColors() {
    const isLightTheme = document.body.classList.contains('theme-light');
    
    if (isLightTheme) {
        return {
            camera: getComputedStyle(document.documentElement).getPropertyValue('--chart-camera-color').trim() || '#dc2626',
            archiver: getComputedStyle(document.documentElement).getPropertyValue('--chart-archiver-color').trim() || '#2563eb',
            controller: getComputedStyle(document.documentElement).getPropertyValue('--chart-controller-color').trim() || '#d97706',
            ccure: getComputedStyle(document.documentElement).getPropertyValue('--chart-ccure-color').trim() || '#7c3aed',
            grid: getComputedStyle(document.documentElement).getPropertyValue('--chart-grid-color').trim() || 'rgba(0, 0, 0, 0.1)',
            text: getComputedStyle(document.documentElement).getPropertyValue('--chart-text-color').trim() || '#1e293b',
            background: getComputedStyle(document.documentElement).getPropertyValue('--chart-bg-color').trim() || '#ffffff'
        };
    } else {
        return {
            camera: getComputedStyle(document.documentElement).getPropertyValue('--chart-camera-color').trim() || '#ff4d4d',
            archiver: getComputedStyle(document.documentElement).getPropertyValue('--chart-archiver-color').trim() || '#4da6ff',
            controller: getComputedStyle(document.documentElement).getPropertyValue('--chart-controller-color').trim() || '#ffaa00',
            ccure: getComputedStyle(document.documentElement).getPropertyValue('--chart-ccure-color').trim() || '#7d3cff',
            grid: getComputedStyle(document.documentElement).getPropertyValue('--chart-grid-color').trim() || 'rgba(255, 255, 255, 0.1)',
            text: getComputedStyle(document.documentElement).getPropertyValue('--chart-text-color').trim() || '#e6eef7',
            background: getComputedStyle(document.documentElement).getPropertyValue('--chart-bg-color').trim() || '#0a0a0a'
        };
    }
}

// ========== UPDATE CHART THEME ==========
function updateChartTheme() {
    if (!offlineChart) return;
    
    const colors = getChartColors();
    
    console.log('Updating chart theme with colors:', colors); // Debug log
    
    // Update chart options
    offlineChart.options.scales.x.grid.color = colors.grid;
    offlineChart.options.scales.y.grid.color = colors.grid;
    offlineChart.options.scales.x.ticks.color = colors.text;
    offlineChart.options.scales.y.ticks.color = colors.text;
    
    // Update plugins
    offlineChart.options.plugins.legend.labels.color = colors.text;
    offlineChart.options.plugins.tooltip.backgroundColor = colors.background;
    offlineChart.options.plugins.tooltip.titleColor = colors.text;
    offlineChart.options.plugins.tooltip.bodyColor = colors.text;
    offlineChart.options.plugins.tooltip.borderColor = colors.grid;
    
    // Update dataset colors
    offlineChart.data.datasets.forEach(dataset => {
        if (dataset.label === "Camera") dataset.backgroundColor = colors.camera;
        if (dataset.label === "Archiver") dataset.backgroundColor = colors.archiver;
        if (dataset.label === "Controller") dataset.backgroundColor = colors.controller;
        if (dataset.label === "CCURE") dataset.backgroundColor = colors.ccure;
    });
    
    offlineChart.update('none'); // Use 'none' for instant update
}

// ========== INIT CHART ==========
function initOfflineChart() {
    const canvas = document.getElementById("DotOfflineDevice");
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    
    const ctx = canvas.getContext("2d");
    const colors = getChartColors();

    console.log('Initializing chart with colors:', colors); // Debug log

    offlineChart = new Chart(ctx, {
        type: "scatter",
        data: {
            datasets: [
                { 
                    label: "Camera", 
                    data: [], 
                    backgroundColor: colors.camera, 
                    pointStyle: "circle", 
                    pointRadius: 6 
                },
                { 
                    label: "Archiver", 
                    data: [], 
                    backgroundColor: colors.archiver, 
                    pointStyle: "rect", 
                    pointRadius: 6 
                },
                { 
                    label: "Controller", 
                    data: [], 
                    backgroundColor: colors.controller, 
                    pointStyle: "triangle", 
                    pointRadius: 7 
                },
                { 
                    label: "CCURE", 
                    data: [], 
                    backgroundColor: colors.ccure, 
                    pointStyle: "rectRot", 
                    pointRadius: 6 
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: colors.text,
                        font: {
                            size: 12
                        },
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: colors.background,
                    titleColor: colors.text,
                    bodyColor: colors.text,
                    borderColor: colors.grid,
                    borderWidth: 1,
                    callbacks: {
                        label: (ctx) => {
                            const d = ctx.raw;
                            const lines = [];
                            if (d.ip) lines.push(`IP: ${d.ip}`);
                            if (d.city) lines.push(`City: ${d.city}`);
                            return lines;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { 
                        display: false, 
                        text: "City" 
                    },
                    grid: {
                        color: colors.grid,
                        drawBorder: true
                    },
                    ticks: {
                        color: colors.text,
                        maxRotation: 0,
                        minRotation: 0,
                        callback: (value) => {
                            return Object.keys(cityIndexMap).find(
                                key => cityIndexMap[key] === value
                            ) || "";
                        }
                    }
                },
                y: {
                    title: { 
                        display: false, 
                        text: "Device Type" 
                    },
                    grid: {
                        color: colors.grid,
                        drawBorder: true
                    },
                    ticks: {
                        color: colors.text,
                        callback: v => dynamicTypeList[v] || ""
                    },
                    min: -0.5,
                    max: () => Math.max(dynamicTypeList.length - 0.5, 0.5)
                }
            }
        }
    });

    // Force initial theme update
    setTimeout(updateChartTheme, 100);
}

// ========== UPDATE CHART DATA ==========
function updateOfflineChart(offlineDevices) {
    if (!offlineChart) {
        console.error('Chart not initialized!');
        return;
    }

    const typeNames = {
        cameras: "Camera",
        archivers: "Archiver", 
        controllers: "Controller",
        servers: "CCURE"
    };

    // Reset mappings
    dynamicTypeList = [];
    dynamicTypeIndexMap = {};
    cityIndexMap = {};
    cityCounter = 0;

    // Only valid types
    const filtered = offlineDevices.filter(dev =>
        typeNames.hasOwnProperty(dev.type)
    );

    // Build dynamic Y indexes
    filtered.forEach(dev => {
        const label = typeNames[dev.type];
        if (!(label in dynamicTypeIndexMap)) {
            dynamicTypeIndexMap[label] = dynamicTypeList.length;
            dynamicTypeList.push(label);
        }
    });

    // Clear all old points
    offlineChart.data.datasets.forEach(ds => ds.data = []);

    // Add points
    filtered.forEach(dev => {
        const source = dev.device ? dev.device : dev;
        const deviceIP = source.ip || null;
        const city = source.city || "Unknown";

        if (!cityIndexMap[city]) {
            cityCounter++;
            cityIndexMap[city] = cityCounter;
        }

        const label = typeNames[dev.type];
        const dynamicY = dynamicTypeIndexMap[label];

        const point = {
            x: cityIndexMap[city],
            y: dynamicY,
            ip: deviceIP,
            city: city
        };

        const dataset = offlineChart.data.datasets.find(
            ds => ds.label === label
        );

        if (dataset) {
            dataset.data.push(point);
        }
    });

    // Hide empty types
    offlineChart.data.datasets.forEach(ds => {
        ds.hidden = ds.data.length === 0;
    });

    // Update Y axis max
    offlineChart.options.scales.y.max = Math.max(dynamicTypeList.length - 0.5, 0.5);
    
    offlineChart.update();
}

// ========== THEME CHANGE DETECTION ==========
function setupThemeObserver() {
    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                console.log('Theme changed, updating chart...');
                setTimeout(updateChartTheme, 50);
            }
        });
    });

    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
}

// ========== INITIALIZE EVERYTHING ==========
function initializeChartSystem() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initOfflineChart();
            setupThemeObserver();
        });
    } else {
        initOfflineChart();
        setupThemeObserver();
    }
}

// Initialize the chart system
initializeChartSystem();

// ========== YOUR EXISTING FUNCTION ==========
function renderOfflineChartFromCombined(combinedDevices) {
    const offlineDevices = combinedDevices
        .filter(d => d.device.status === "offline")
        .map(d => ({
            device: d.device,
            type: d.device.type
        }));

    updateOfflineChart(offlineDevices);
}
