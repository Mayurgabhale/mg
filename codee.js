let offlineChart;
let cityIndexMap = {};
let cityCounter = 0;

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
                            return [
                                `Name: ${d.name}`,
                                `IP: ${d.ip}`,
                                `City: ${d.city}`
                            ];
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
                        callback: v => deviceTypeLabel(v)
                    },
                    min: -0.5,
                    max: 3.5
                }
            }
        }
    });
}

function deviceTypeLabel(v) {
    return ["Camera", "Archiver", "Controller", "CCURE"][v] || "";
}

function updateOfflineChart(offlineDevices) {

    const typeMap = {
        cameras: 0,
        archivers: 1,
        controllers: 2,
        servers: 3   // CCURE
    };

    // Reset mapping every refresh
    cityIndexMap = {};
    cityCounter = 0;

    const filtered = offlineDevices.filter(dev =>
        Object.keys(typeMap).includes(dev.type)
    );

    // Clear datasets
    offlineChart.data.datasets.forEach(ds => ds.data = []);

    filtered.forEach(dev => {

        const city = dev.city || "Unknown";

        if (!cityIndexMap[city]) {
            cityCounter++;
            cityIndexMap[city] = cityCounter;
        }

        const typeIndex = typeMap[dev.type];

        const point = {
            x: cityIndexMap[city],   // 👈 City-based X value
            y: typeIndex,
            name: dev.name || "Unknown",
            ip: dev.ip || "N/A",
            city: city
        };

        offlineChart.data.datasets[typeIndex].data.push(point);
    });

    offlineChart.update();
}

window.initOfflineChart = initOfflineChart;
window.updateOfflineChart = updateOfflineChart;