  name: dev.name || "Unknown",
            ip: dev.ip || "N/A",

      for all name and ip not show, 

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

        const city = dev.city || "Unknown";

        if (!cityIndexMap[city]) {
            cityCounter++;
            cityIndexMap[city] = cityCounter;
        }

        const deviceLabel = typeNames[dev.type];
        const dynamicY = dynamicTypeIndexMap[deviceLabel];

        const point = {
            x: cityIndexMap[city],
            y: dynamicY,   // 👈 Dynamic Y index
            name: dev.name || "Unknown",
            ip: dev.ip || "N/A",
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


........
read this code first 

function updateSummary(data) {
    const summary = data.summary || {};

    // ✅ Always keep last known values if new data doesn’t have them
    window.lastSummary = window.lastSummary || {};
    const merged = {
        totalDevices: summary.totalDevices ?? window.lastSummary.totalDevices ?? 0,
        totalOnlineDevices: summary.totalOnlineDevices ?? window.lastSummary.totalOnlineDevices ?? 0,
        totalOfflineDevices: summary.totalOfflineDevices ?? window.lastSummary.totalOfflineDevices ?? 0,

        cameras: { ...window.lastSummary.cameras, ...summary.cameras },
        archivers: { ...window.lastSummary.archivers, ...summary.archivers },
        controllers: { ...window.lastSummary.controllers, ...summary.controllers },
        servers: { ...window.lastSummary.servers, ...summary.servers },
        pcdetails: { ...window.lastSummary.pcdetails, ...summary.pcdetails },
        dbdetails: { ...window.lastSummary.dbdetails, ...summary.dbdetails },

        // 🆕 door/reader extras merged (summary.controllerExtras is created in fetchData)
        controllerExtras: { ...window.lastSummary.controllerExtras, ...summary.controllerExtras }
    };


    // 🆕 Recalculate totals to include Door counts (but not Readers)
    const doors = merged.controllerExtras?.doors || { total: 0, online: 0, offline: 0 };

    // Recompute totals including doors
    merged.totalDevices =
        (merged.cameras?.total || 0) +
        (merged.archivers?.total || 0) +
        (merged.controllers?.total || 0) +
        (merged.servers?.total || 0) +
        (merged.pcdetails?.total || 0) +
        (merged.dbdetails?.total || 0) +
        doors.total; // ✅ include doors only

    merged.totalOnlineDevices =
        (merged.cameras?.online || 0) +
        (merged.archivers?.online || 0) +
        (merged.controllers?.online || 0) +
        (merged.servers?.online || 0) +
        (merged.pcdetails?.online || 0) +
        (merged.dbdetails?.online || 0) +
        doors.online; // ✅ include doors only

    merged.totalOfflineDevices =
        merged.totalDevices - merged.totalOnlineDevices;




    // ✅ Save merged result for next refresh
    window.lastSummary = merged;

    // Update UI safely
    document.getElementById("total-devices").textContent = merged.totalDevices;
    document.getElementById("online-devices").textContent = merged.totalOnlineDevices;
    document.getElementById("offline-devices").textContent = merged.totalOfflineDevices;

    document.getElementById("camera-total").textContent = merged.cameras?.total || 0;
    document.getElementById("camera-online").textContent = merged.cameras?.online || 0;
    document.getElementById("camera-offline").textContent = merged.cameras?.offline || 0;

    document.getElementById("archiver-total").textContent = merged.archivers?.total || 0;
    document.getElementById("archiver-online").textContent = merged.archivers?.online || 0;
    document.getElementById("archiver-offline").textContent = merged.archivers?.offline || 0;

    document.getElementById("controller-total").textContent = merged.controllers?.total || 0;
    document.getElementById("controller-online").textContent = merged.controllers?.online || 0;
    document.getElementById("controller-offline").textContent = merged.controllers?.offline || 0;

    document.getElementById("server-total").textContent = merged.servers?.total || 0;
    document.getElementById("server-online").textContent = merged.servers?.online || 0;
    document.getElementById("server-offline").textContent = merged.servers?.offline || 0;

    // ✅ Fix for Desktop and DB Server
    document.getElementById("pc-total").textContent = merged.pcdetails?.total || 0;
    document.getElementById("pc-online").textContent = merged.pcdetails?.online || 0;
    document.getElementById("pc-offline").textContent = merged.pcdetails?.offline || 0;

    document.getElementById("db-total").textContent = merged.dbdetails?.total || 0;
    document.getElementById("db-online").textContent = merged.dbdetails?.online || 0;
    document.getElementById("db-offline").textContent = merged.dbdetails?.offline || 0;

    // ✅  new for Door and Reader 
    // ====== Door / Reader card updates (from controllers API) ======
    const extras = merged.controllerExtras || {};
    // If you used a single Door/Reader card with ids: doorReader-total, doorReader-online, doorReader-offline
    if (extras.doors) {
        const doorTotalEl = document.getElementById("doorReader-total");
        const doorOnlineEl = document.getElementById("doorReader-online");
        const doorOfflineEl = document.getElementById("doorReader-offline");
        if (doorTotalEl) doorTotalEl.textContent = extras.doors.total || 0;
        if (doorOnlineEl) doorOnlineEl.textContent = extras.doors.online || 0;
        if (doorOfflineEl) doorOfflineEl.textContent = extras.doors.offline || 0;
    } else {
        // fallback -> clear
        if (document.getElementById("doorReader-total")) document.getElementById("doorReader-total").textContent = 0;
        if (document.getElementById("doorReader-online")) document.getElementById("doorReader-online").textContent = 0;
        if (document.getElementById("doorReader-offline")) document.getElementById("doorReader-offline").textContent = 0;
    }

    if (extras.readers) {
        const rTotalEl = document.getElementById("reader-total-inline");
        const rOnlineEl = document.getElementById("reader-online-inline");
        const rOfflineEl = document.getElementById("reader-offline-inline");
        // NOTE: your HTML currently has the Door/Reader card as a single combined card.
        // If you want to surface readers separately on the same card, you can add spans with these IDs
        // inside the card or reuse the same doorReader-* elements. For now we only populate doorReader-*.
        // Keep these lines if you create these spans, otherwise they're safe (will be null).
        if (rTotalEl) rTotalEl.textContent = extras.readers.total || 0;
        if (rOnlineEl) rOnlineEl.textContent = extras.readers.online || 0;
        if (rOfflineEl) rOfflineEl.textContent = extras.readers.offline || 0;
    }
}
