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
        { label: "Camera",     data: [], backgroundColor: "#ff4d4d", pointStyle: "circle",   pointRadius: 6 },
        { label: "Archiver",   data: [], backgroundColor: "#4da6ff", pointStyle: "rect",     pointRadius: 6 },
        { label: "Controller", data: [], backgroundColor: "#ffaa00", pointStyle: "triangle", pointRadius: 7 },
        { label: "CCURE",      data: [], backgroundColor: "#7d3cff", pointStyle: "rectRot",  pointRadius: 6 }
      ]
    },
    options: {
      responsive: true,

      plugins: {
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const d = ctx.raw;
              const lines = [];

              if (d.name) lines.push(`Name: ${d.name}`);
              if (d.ip)   lines.push(`IP: ${d.ip}`);
              if (d.city) lines.push(`City: ${d.city}`);

              return lines;
            }
          }
        }
      },

      scales: {
        x: {
          title: { display: true, text: "City" },
          ticks: {
            callback: (value) => {
              return Object.keys(cityIndexMap).find(
                key => cityIndexMap[key] === value
              ) || "";
            }
          }
        },

        y: {
          title: { display: true, text: "Device Type" },
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

    const deviceName = source.name || "Unknown";
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
      name: deviceName,
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
    name: device.cameraname || 
          device.controllername || 
          device.archivername || 
          device.servername || 
          device.hostname || 
          "Unknown",

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