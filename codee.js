function updateSummary(data) {
    const summary = data.summary || {};

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
        controllerExtras: { ...window.lastSummary.controllerExtras, ...summary.controllerExtras },
    };

    // 🆕 ADDED: recompute total devices dynamically to include Doors and Readers
    const doors = merged.controllerExtras?.doors || { total: 0, online: 0, offline: 0 };
    const readers = merged.controllerExtras?.readers || { total: 0, online: 0, offline: 0 };

    // Recalculate the grand totals
    merged.totalDevices =
        (merged.cameras?.total || 0) +
        (merged.archivers?.total || 0) +
        (merged.controllers?.total || 0) +
        (merged.servers?.total || 0) +
        (merged.pcdetails?.total || 0) +
        (merged.dbdetails?.total || 0) +
        doors.total +
        readers.total;

    merged.totalOnlineDevices =
        (merged.cameras?.online || 0) +
        (merged.archivers?.online || 0) +
        (merged.controllers?.online || 0) +
        (merged.servers?.online || 0) +
        (merged.pcdetails?.online || 0) +
        (merged.dbdetails?.online || 0) +
        doors.online +
        readers.online;

    merged.totalOfflineDevices =
        (merged.totalDevices - merged.totalOnlineDevices);

    // ✅ Save merged result for next refresh
    window.lastSummary = merged;