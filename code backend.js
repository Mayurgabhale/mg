for (const [key, devices] of Object.entries(data.details)) {
    if (!Array.isArray(devices) || devices.length === 0) continue;

    const deviceType = key.toLowerCase();

    // 🚫 HIDE CONTROLLER_DOORS from card creation
    if (deviceType === "controller_doors") continue;

    // ensure map entry exists
    if (!typeCityMap[deviceType]) typeCityMap[deviceType] = new Set();