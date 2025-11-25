dark theme color is not chagne 
  when i do dark them i wan to chagne my graph color theme alos ok 
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

/* Remove any potential overflow */
* {
    box-sizing: border-box;
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
