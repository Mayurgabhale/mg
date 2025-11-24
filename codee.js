anything is not show in not show,, 

let offlineChart;
let cityIndexMap = {};
let cityCounter = 0;

let dynamicTypeIndexMap = {};   // Dynamic Y-axis mapping
let dynamicTypeList = [];       // Track visible types

function initOfflineChart() {
  const canvas = document.getElementById("DotOfflineDevice");
  const ctx = canvas.getContext("2d");

  offlineChart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Camera",
          data: [],
          backgroundColor: "#ff4d4d",
          pointStyle: "circle",
          pointRadius: 6
        },
        {
          label: "Archiver",
          data: [],
          backgroundColor: "#4da6ff",
          pointStyle: "rect",
          pointRadius: 6
        },
        {
          label: "Controller",
          data: [],
          backgroundColor: "#ffaa00",
          pointStyle: "triangle",
          pointRadius: 7
        },
        {
          label: "CCURE",
          data: [],
          backgroundColor: "#7d3cff",
          pointStyle: "rectRot",
          pointRadius: 6
        }
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

              if (d.name && d.name !== "Unknown") {
                lines.push(`Name: ${d.name}`);
              }

              if (d.ip && d.ip !== "N/A" && d.ip !== "null") {
                lines.push(`IP: ${d.ip}`);
              }

              // lines.push(`City: ${d.city}`);
              lines.push(`IP: ${d.ip}`);

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
            callback: v => getDynamicTypeLabel(v)
          },
          min: -0.5,
          max: () => dynamicTypeList.length - 0.5
        }
      }
    }
  });
}

/* ✅ Dynamic label for Y-axis */
function getDynamicTypeLabel(value) {
  return dynamicTypeList[value] || "";
}

function updateOfflineChart(offlineDevices) {

  const typeNames = {
    cameras: "Camera",
    archivers: "Archiver",
    controllers: "Controller",
    servers: "CCURE"
  };

  // Reset Y mappings
  dynamicTypeList = [];
  dynamicTypeIndexMap = {};

  // Reset city mappings
  cityIndexMap = {};
  cityCounter = 0;

  // Filter only known types
  const filtered = offlineDevices.filter(dev =>
    typeNames.hasOwnProperty(dev.type)
  );

  // Detect which types actually exist
  filtered.forEach(dev => {
    const label = typeNames[dev.type];

    if (!dynamicTypeIndexMap[label]) {
      dynamicTypeIndexMap[label] = dynamicTypeList.length;
      dynamicTypeList.push(label);
    }
  });

  // Clear datasets
  offlineChart.data.datasets.forEach(ds => ds.data = []);

  filtered.forEach(dev => {

    // const city = dev.city || "Unknown";

    if (!cityIndexMap[city]) {
      cityCounter++;
      cityIndexMap[city] = cityCounter;
    }

    const deviceLabel = typeNames[dev.type];
    const dynamicY = dynamicTypeIndexMap[deviceLabel];

    // const point = {
    //     x: cityIndexMap[city],
    //     y: dynamicY,   // 👈 Dynamic Y index
    //     name: dev.name || "Unknown",
    //     ip: dev.ip || "N/A",
    //     city: city
    // };



    // ✅ Your structure from combinedDevices
    const source = dev.device ? dev.device : dev;

    const deviceName = source.name || null;
    const deviceIP = source.ip || null;
    const city = source.city || "Unknown";

    const point = {
      x: cityIndexMap[city],
      y: dynamicY,
      name: deviceName,
      ip: deviceIP,
      city: city
    };



    // Push into correct dataset by label
    const dataset = offlineChart.data.datasets.find(
      ds => ds.label === deviceLabel
    );

    if (dataset) {
      dataset.data.push(point);
    }
  });

  // Hide datasets with no data (no offline devices)
  offlineChart.data.datasets.forEach(ds => {
    ds.hidden = ds.data.length === 0;
  });

  offlineChart.update();
}

window.initOfflineChart = initOfflineChart;
window.updateOfflineChart = updateOfflineChart;

                    // push device with normalized vendor (may be empty string if unknown)
                    combinedDevices.push({
                        card: card,
                        device: {
                            ip:deviceIP,
                            type: deviceType,
                            status: currentStatus,
                            city: city,
                            vendor: datasetVendorValue // already normalized (uppercase) or ""
                        }
                    });
                });
            }
