<canvas id="DotOfflineDevice"></canvas>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="graph.js"></script>







let offlineChart;

/**
 * Call once after page load
 */
function initOfflineChart() {

    const canvas = document.getElementById("DotOfflineDevice");
    const ctx = canvas.getContext("2d");

    offlineChart = new Chart(ctx, {
        type: "scatter",
        data: {
            datasets: [{
                label: "Offline Devices",
                data: [],
                backgroundColor: "red",
                pointRadius: 6,
                pointHoverRadius: 9
            }]
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
                                `City: ${d.city}`,
                                `Last Seen: ${new Date(d.lastSeen).toLocaleString()}`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: "Last Seen Time" },
                    ticks: {
                        callback: v => new Date(v).toLocaleString()
                    }
                },
                y: {
                    title: { display: true, text: "Device Type" },
                    ticks: {
                        callback: v => deviceTypeLabel(v)
                    }
                }
            }
        }
    });
}

/**
 * Maps type number to readable label on Y axis
 */
function deviceTypeLabel(v) {
    const labels = {
        0: "Camera",
        1: "Server",
        2: "Controller",
        3: "PC",
        4: "Other"
    };
    return labels[v] || "Other";
}

/**
 * Call this from script.js where you already calculate offline devices
 */
function updateOfflineChart(offlineDevices) {

    const typeMap = {
        cameras: 0,
        servers: 1,
        controllers: 2,
        pcdetails: 3
    };

    const points = offlineDevices.map(dev => ({
        x: Date.parse(dev.lastSeen) || Date.now(),
        y: typeMap[dev.type] ?? 4,
        name: dev.name || "Unknown",
        ip: dev.ip || "N/A",
        city: dev.city || "N/A",
        lastSeen: dev.lastSeen
    }));

    offlineChart.data.datasets[0].data = points;
    offlineChart.update();
}

window.initOfflineChart = initOfflineChart;
window.updateOfflineChart = updateOfflineChart;