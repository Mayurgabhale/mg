combinedDevices.push({
  card: card,
  device: {
      name: device.cameraname || 
            device.controllername || 
            device.archivername || 
            device.servername || 
            device.hostname || 
            "Unknown",

      ip: deviceIP,  // ✅ VERY IMPORTANT

      type: deviceType,
      status: currentStatus,
      city: city,
      vendor: datasetVendorValue
  }
});






const offlineDevices = filteredSummaryDevices
  .filter(d => d.status === "offline")
  .map(d => ({
      name: d.name,
      ip: d.ip,  // ✅ Now real IP is here
      city: d.city,
      type: d.type,
      lastSeen: new Date().toISOString()
  }));