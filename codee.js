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
            camera: '#dc2626',
            archiver: '#2563eb', 
            controller: '#d97706',
            ccure: '#7c3aed',
            grid: 'rgba(0, 0, 0, 0.1)',
            text: '#1e293b',
            background: '#ffffff'
        };
    } else {
        // Dark theme colors - fixed for visibility
        return {
            camera: '#ff4d4d',
            archiver: '#4da6ff',
            controller: '#ffaa00', 
            ccure: '#7d3cff',
            grid: 'rgba(255, 255, 255, 0.2)', // Visible grid lines
            text: '#e6eef7', // Visible text color
            background: '#0a0a0a'
        };
    }
}

// ========== UPDATE CHART THEME ==========
function updateChartTheme() {
    if (!offlineChart) return;
    
    const colors = getChartColors();
    
    // Update grid lines and borders
    offlineChart.options.scales.x.grid.color = colors.grid;
    offlineChart.options.scales.y.grid.color = colors.grid;
    
    // Update text colors
    offlineChart.options.scales.x.ticks.color = colors.text;
    offlineChart.options.scales.y.ticks.color = colors.text;
    
    // Update legend text color
    if (offlineChart.options.plugins.legend) {
        offlineChart.options.plugins.legend.labels.color = colors.text;
    }
    
    offlineChart.update();
}

// ========== INIT CHART ==========
function initOfflineChart() {
    const canvas = document.getElementById("DotOfflineDevice");
    const ctx = canvas.getContext("2d");
    
    const colors = getChartColors();

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
                        color: colors.text, // Set legend text color
                        font: {
                            size: 12
                        },
                        usePointStyle: true
                    }
                },
                tooltip: {
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
                        color: colors.grid, // Set grid line color
                        drawBorder: true
                    },
                    ticks: {
                        color: colors.text, // Set x-axis text color
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
                        color: colors.grid, // Set grid line color
                        drawBorder: true
                    },
                    ticks: {
                        color: colors.text, // Set y-axis text color
                        callback: v => dynamicTypeList[v] || ""
                    },
                    min: -0.5,
                    max: () => Math.max(dynamicTypeList.length - 0.5, 0.5)
                }
            }
        }
    });
}

// ========== UPDATE CHART ==========
function updateOfflineChart(offlineDevices) {
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

    offlineChart.update();
}

// ========== THEME CHANGE DETECTION ==========
function setupThemeObserver() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                setTimeout(updateChartTheme, 100);
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