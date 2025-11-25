the issue is in the js code,
this is our first code in this boht theme is work
ony small issue is th when dark theme is apply that time only graph inside line are not disply 
and text alos not diplsy  correct when dark theme is apply ok so i watn the above code, but wiht correct theme colro ok 
// ========== GLOBALS ==========
let offlineChart;

let cityIndexMap = {};
let cityCounter = 0;

let dynamicTypeIndexMap = {};
let dynamicTypeList = [];

// ========== INIT CHART ==========
function initOfflineChart() {

  const canvas = document.getElementById("DotOfflineDevice");
  const ctx = canvas.getContext("2d");

  offlineChart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        { label: "Camera", data: [], backgroundColor: "#ff4d4d", pointStyle: "circle", pointRadius: 6 },
        { label: "Archiver", data: [], backgroundColor: "#4da6ff", pointStyle: "rect", pointRadius: 6 },
        { label: "Controller", data: [], backgroundColor: "#ffaa00", pointStyle: "triangle", pointRadius: 7 },
        { label: "CCURE", data: [], backgroundColor: "#7d3cff", pointStyle: "rectRot", pointRadius: 6 }
      ]
    },
    options: {
      responsive: true,
      cutout: '40%',
      radius: '80%',  // ✅ shrink only circle size
      plugins: {
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const d = ctx.raw;
              const lines = [];

              // if (d.name) lines.push(`Name: ${d.name}`);
              if (d.ip) lines.push(`IP: ${d.ip}`);
              if (d.city) lines.push(`City: ${d.city}`);

              return lines;
            }
          }
        }
      },

      scales: {
        x: {
          title: { display: false, text: "City" },

          ticks: {
            maxRotation: 0,   // ✅ force no rotation
            minRotation: 0,   // ✅ force horizontal

            callback: (value) => {
              return Object.keys(cityIndexMap).find(
                key => cityIndexMap[key] === value
              ) || "";
            }
          }
        },

        y: {
          title: { display: false, text: "Device Type" },
          ticks: {
            callback: v => dynamicTypeList[v] || ""
          },
          min: -0.5,
          max: () => dynamicTypeList.length - 0.5
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

    // ✅ support both direct and combinedDevices format
    const source = dev.device ? dev.device : dev;

    // const deviceName = source.name || "Unknown";
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
      // name: deviceName,
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

// ========== YOUR EXISTING PUSH (UNCHANGED) ==========
combinedDevices.push({
  card: card,
  device: {
    // name: device.cameraname || 
    //       device.controllername || 
    //       device.archivername || 
    //       device.servername || 
    //       device.hostname || 
    //       "Unknown",

    ip: deviceIP,
    type: deviceType,
    status: currentStatus,
    city: city,
    vendor: datasetVendorValue
  }
});

// ========== CALL THIS WHEN YOU WANT TO UPDATE ==========
function renderOfflineChartFromCombined(combinedDevices) {

  const offlineDevices = combinedDevices
    .filter(d => d.device.status === "offline")
    .map(d => ({
      device: d.device,
      type: d.device.type
    }));

  updateOfflineChart(offlineDevices);
}











// // ========== GLOBALS ==========
// let offlineChart;
// let cityIndexMap = {};
// let cityCounter = 0;
// let dynamicTypeIndexMap = {};
// let dynamicTypeList = [];

// // ========== GET CHART COLORS BASED ON THEME ==========
// function getChartColors() {
//     const isLightTheme = document.body.classList.contains('theme-light');
    
//     if (isLightTheme) {
//         return {
//             camera: '#dc2626',
//             archiver: '#2563eb',
//             controller: '#d97706',
//             ccure: '#7c3aed',
//             grid: '#4278caff', // Visible grid lines
//             text: '#01060eff', // Dark text for axis
//             background: '#ffffff',
//             axis: '#010811ff' // Specific axis color
//         };
//     } else {
//         return {
//             camera: '#ff4d4d',
//             archiver: '#4da6ff',
//             controller: '#ffaa00',
//             ccure: '#7d3cff',
//             grid: 'rgba(255, 255, 255, 0.2)',
//             text: '#e6eef7',
//             background: '#0a0a0a',
//             axis: '#e6eef7'
//         };
//     }
// }

// // ========== UPDATE CHART THEME ==========
// function updateChartTheme() {
//     if (!offlineChart) return;
    
//     const colors = getChartColors();
    
//     console.log('Updating chart theme with colors:', colors);
    
//     // Update chart options for X axis
//     offlineChart.options.scales.x.grid.color = colors.grid;
//     offlineChart.options.scales.x.ticks.color = colors.text;
//     offlineChart.options.scales.x.border.color = colors.grid;
    
//     // Update chart options for Y axis  
//     offlineChart.options.scales.y.grid.color = colors.grid;
//     offlineChart.options.scales.y.ticks.color = colors.text;
//     offlineChart.options.scales.y.border.color = colors.grid;
    
//     // Update plugins
//     offlineChart.options.plugins.legend.labels.color = colors.text;
//     offlineChart.options.plugins.tooltip.backgroundColor = colors.background;
//     offlineChart.options.plugins.tooltip.titleColor = colors.text;
//     offlineChart.options.plugins.tooltip.bodyColor = colors.text;
//     offlineChart.options.plugins.tooltip.borderColor = colors.grid;
    
//     // Update dataset colors
//     offlineChart.data.datasets.forEach(dataset => {
//         if (dataset.label === "Camera") dataset.backgroundColor = colors.camera;
//         if (dataset.label === "Archiver") dataset.backgroundColor = colors.archiver;
//         if (dataset.label === "Controller") dataset.backgroundColor = colors.controller;
//         if (dataset.label === "CCURE") dataset.backgroundColor = colors.ccure;
//     });
    
//     offlineChart.update('none');
// }

// // ========== INIT CHART ==========
// function initOfflineChart() {
//     const canvas = document.getElementById("DotOfflineDevice");
//     if (!canvas) {
//         console.error('Canvas element not found!');
//         return;
//     }
    
//     const ctx = canvas.getContext("2d");
//     const colors = getChartColors();

//     console.log('Initializing chart with colors:', colors);

//     offlineChart = new Chart(ctx, {
//         type: "scatter",
//         data: {
//             datasets: [
//                 { 
//                     label: "Camera", 
//                     data: [], 
//                     backgroundColor: colors.camera, 
//                     pointStyle: "circle", 
//                     pointRadius: 6 
//                 },
//                 { 
//                     label: "Archiver", 
//                     data: [], 
//                     backgroundColor: colors.archiver, 
//                     pointStyle: "rect", 
//                     pointRadius: 6 
//                 },
//                 { 
//                     label: "Controller", 
//                     data: [], 
//                     backgroundColor: colors.controller, 
//                     pointStyle: "triangle", 
//                     pointRadius: 7 
//                 },
//                 { 
//                     label: "CCURE", 
//                     data: [], 
//                     backgroundColor: colors.ccure, 
//                     pointStyle: "rectRot", 
//                     pointRadius: 6 
//                 }
//             ]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: {
//                 legend: {
//                     display: true,
//                     position: 'top',
//                     labels: {
//                         color: colors.text,
//                         font: {
//                             size: 12,
//                             weight: '500'
//                         },
//                         usePointStyle: true,
//                         padding: 15
//                     }
//                 },
//                 tooltip: {
//                     backgroundColor: colors.background,
//                     titleColor: colors.text,
//                     bodyColor: colors.text,
//                     borderColor: colors.grid,
//                     borderWidth: 1,
//                     callbacks: {
//                         label: (ctx) => {
//                             const d = ctx.raw;
//                             const lines = [];
//                             if (d.ip) lines.push(`IP: ${d.ip}`);
//                             if (d.city) lines.push(`City: ${d.city}`);
//                             return lines;
//                         }
//                     }
//                 }
//             },
//             scales: {
//                 x: {
//                     title: { 
//                         display: true,
//                         text: "City",
//                         color: colors.text,
//                         font: {
//                             size: 12,
//                             weight: 'bold'
//                         }
//                     },
//                     grid: {
//                         color: colors.grid,
//                         drawBorder: true,
//                         lineWidth: 1
//                     },
//                     ticks: {
//                         color: colors.text,
//                         maxRotation: 45,
//                         minRotation: 0,
//                         font: {
//                             size: 11
//                         },
//                         callback: (value) => {
//                             return Object.keys(cityIndexMap).find(
//                                 key => cityIndexMap[key] === value
//                             ) || "";
//                         }
//                     },
//                     border: {
//                         color: colors.grid
//                     }
//                 },
//                 y: {
//                     title: { 
//                         display: true,
//                         text: "Device Type",
//                         color: colors.text,
//                         font: {
//                             size: 12,
//                             weight: 'bold'
//                         }
//                     },
//                     grid: {
//                         color: colors.grid,
//                         drawBorder: true,
//                         lineWidth: 1
//                     },
//                     ticks: {
//                         color: colors.text,
//                         font: {
//                             size: 11
//                         },
//                         callback: v => dynamicTypeList[v] || ""
//                     },
//                     min: -0.5,
//                     max: () => Math.max(dynamicTypeList.length - 0.5, 0.5),
//                     border: {
//                         color: colors.grid
//                     }
//                 }
//             }
//         }
//     });

//     // Force initial theme update
//     setTimeout(updateChartTheme, 100);
// }

// // ========== UPDATE CHART DATA ==========
// function updateOfflineChart(offlineDevices) {
//     if (!offlineChart) {
//         console.error('Chart not initialized!');
//         return;
//     }

//     const typeNames = {
//         cameras: "Camera",
//         archivers: "Archiver", 
//         controllers: "Controller",
//         servers: "CCURE"
//     };

//     // Reset mappings
//     dynamicTypeList = [];
//     dynamicTypeIndexMap = {};
//     cityIndexMap = {};
//     cityCounter = 0;

//     // Only valid types
//     const filtered = offlineDevices.filter(dev =>
//         typeNames.hasOwnProperty(dev.type)
//     );

//     // Build dynamic Y indexes
//     filtered.forEach(dev => {
//         const label = typeNames[dev.type];
//         if (!(label in dynamicTypeIndexMap)) {
//             dynamicTypeIndexMap[label] = dynamicTypeList.length;
//             dynamicTypeList.push(label);
//         }
//     });

//     // Clear all old points
//     offlineChart.data.datasets.forEach(ds => ds.data = []);

//     // Add points
//     filtered.forEach(dev => {
//         const source = dev.device ? dev.device : dev;
//         const deviceIP = source.ip || null;
//         const city = source.city || "Unknown";

//         if (!cityIndexMap[city]) {
//             cityCounter++;
//             cityIndexMap[city] = cityCounter;
//         }

//         const label = typeNames[dev.type];
//         const dynamicY = dynamicTypeIndexMap[label];

//         const point = {
//             x: cityIndexMap[city],
//             y: dynamicY,
//             ip: deviceIP,
//             city: city
//         };

//         const dataset = offlineChart.data.datasets.find(
//             ds => ds.label === label
//         );

//         if (dataset) {
//             dataset.data.push(point);
//         }
//     });

//     // Hide empty types
//     offlineChart.data.datasets.forEach(ds => {
//         ds.hidden = ds.data.length === 0;
//     });

//     // Update Y axis max
//     offlineChart.options.scales.y.max = Math.max(dynamicTypeList.length - 0.5, 0.5);
    
//     offlineChart.update();
// }

// // ========== THEME CHANGE DETECTION ==========
// function setupThemeObserver() {
//     const observer = new MutationObserver((mutations) => {
//         mutations.forEach((mutation) => {
//             if (mutation.attributeName === 'class') {
//                 console.log('Theme changed, updating chart...');
//                 setTimeout(updateChartTheme, 100);
//             }
//         });
//     });

//     observer.observe(document.body, {
//         attributes: true,
//         attributeFilter: ['class']
//     });
// }

// // ========== INITIALIZE EVERYTHING ==========
// function initializeChartSystem() {
//     if (document.readyState === 'loading') {
//         document.addEventListener('DOMContentLoaded', function() {
//             initOfflineChart();
//             setupThemeObserver();
//         });
//     } else {
//         initOfflineChart();
//         setupThemeObserver();
//     }
// }

// // Initialize the chart system
// initializeChartSystem();

// // ========== YOUR EXISTING FUNCTION ==========
// function renderOfflineChartFromCombined(combinedDevices) {
//     const offlineDevices = combinedDevices
//         .filter(d => d.device.status === "offline")
//         .map(d => ({
//             device: d.device,
//             type: d.device.type
//         }));

//     updateOfflineChart(offlineDevices);
// }
