all dipsly in yellwo not,
  red
i watn only offline ocunt red 
let cityChart = null;

function drawCityBarChart() {

  const chartCanvas = document.getElementById("cityBarChart");
  if (!chartCanvas) {
    console.warn("Canvas not found");
    return;
  }

  if (!CITY_LIST || CITY_LIST.length === 0) {
    console.warn("CITY_LIST empty. Chart not drawn.");
    const lg = document.getElementById("cityBarLegend");
    if (lg) lg.remove();
    return;
  }

  const labels = CITY_LIST.map(c => c.city);

  const data = CITY_LIST.map(c => {
    if (!c.devices) return 0;
    return Object.values(c.devices).reduce((a, b) => a + b, 0);
  });

  const riskInfo = CITY_LIST.map(c => {
    const score = computeCityRiskScore(c);
    return mapScoreToRisk(score);
  });

  const colors = riskInfo.map(r => r.color);
  const riskLabels = riskInfo.map(r => r.label);

  if (cityChart) cityChart.destroy();

  cityChart = new Chart(chartCanvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Total Devices",
        data: data,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.8,
        categoryPercentage: 0.9
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },

        // tooltip: {
        //   callbacks: {
        //     title: function (items) {
        //       return labels[items[0].dataIndex];
        //     },

        //     label: function (item) {
        //       const idx = item.dataIndex;
        //       const c = CITY_LIST[idx] || {};

        //       const total = c.devices
        //         ? Object.values(c.devices).reduce((a, b) => a + b, 0)
        //         : 0;

        //       const camOff = (c.offline && c.offline.camera) || 0;
        //       const ctrlOff = (c.offline && c.offline.controller) || 0;
        //       const srvOff = (c.offline && c.offline.server) || 0;
        //       const archOff = (c.offline && c.offline.archiver) || 0;

        //       const risk = riskLabels[idx] || "Low";

        //       return [
        //         `Total Devices: ${total}`,
        //         `Risk Level: ${risk}`,
        //         `Offline Camera: ${camOff}`,
        //         `Offline Controller: ${ctrlOff}`,
        //         `Offline Server: ${srvOff}`,
        //         `Offline Archiver: ${archOff}`
        //       ];
        //     }


        //   }
        // }


        tooltip: {
          callbacks: {
            title: function (items) {
              return labels[items[0].dataIndex];
            },

            label: function (item) {
              const idx = item.dataIndex;
              const c = CITY_LIST[idx] || {};

              const total = c.devices
                ? Object.values(c.devices).reduce((a, b) => a + b, 0)
                : 0;

              const camOff = (c.offline && c.offline.camera) || 0;
              const ctrlOff = (c.offline && c.offline.controller) || 0;
              const srvOff = (c.offline && c.offline.server) || 0;
              const archOff = (c.offline && c.offline.archiver) || 0;

              const risk = riskLabels[idx] || "Low";

              return [
                `Total Devices: ${total}`,
                `Risk Level: ${risk}`,
                `Offline Camera: ${camOff}`,
                `Offline Controller: ${ctrlOff}`,
                `Offline Server: ${srvOff}`,
                `Offline Archiver: ${archOff}`
              ];
            },

            labelTextColor: function (context) {
              const idx = context.dataIndex;
              const c = CITY_LIST[idx] || {};

              const camOff = (c.offline && c.offline.camera) || 0;
              const ctrlOff = (c.offline && c.offline.controller) || 0;
              const srvOff = (c.offline && c.offline.server) || 0;
              const archOff = (c.offline && c.offline.archiver) || 0;

              // Return color for EACH line (because you returned multiple lines)
              return [
                "#ffffff", // Total Devices
                "#ffffff", // Risk Level
                camOff > 0 ? "red" : "#ffffff",
                ctrlOff > 0 ? "red" : "#ffffff",
                srvOff > 0 ? "red" : "#ffffff",
                archOff > 0 ? "red" : "#ffffff"
              ];
            }
          }
        }



      },
      scales: {
        y: {
          beginAtZero: true
        },


        x: {
          ticks: {
            display: true,
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,

            callback: function (value, index) {
              const risk = riskLabels[index];

              if (risk === "Medium" || risk === "High") {
                return labels[index];
              }
              return "";
            },

            color: function (context) {
              const idx = context.index;
              const risk = riskLabels[idx];
              return (risk === "Medium" || risk === "High") ? "red" : "#666";
            }
          },
          grid: {
            display: true
          }
        }


      }
    }
  });

  // Add legend in top-right
  createCityLegend("cityBarLegend");

  console.log("✅ City bar chart updated with top-right legend");
}
