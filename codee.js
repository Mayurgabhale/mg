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