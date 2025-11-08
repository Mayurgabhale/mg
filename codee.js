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