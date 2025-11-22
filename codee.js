// Calculate failure counts from your device data - DYNAMIC VERSION
function calculateFailureCounts(deviceDetails) {
  console.log('CALCULATING FAILURE COUNTS from device details:', deviceDetails);
  
  const counts = {
    cameras: 0,
    controllers: 0,
    archivers: 0,
    servers: 0,
    desktops: 0,
    dbServers: 0
  };

  if (!deviceDetails || typeof deviceDetails !== 'object') {
    console.warn('No valid device details provided');
    return counts;
  }

  if (!window.deviceHistoryData) {
    console.warn('No device history data available yet');
    return counts;
  }

  console.log('Available device history data keys:', Object.keys(window.deviceHistoryData).length);

  // Process each device type with proper error handling
  const deviceTypes = ['cameras', 'archivers', 'controllers', 'servers', 'pcDetails', 'DBDetails'];
  
  deviceTypes.forEach(type => {
    const devices = deviceDetails[type] || [];
    console.log(`Processing ${type}: ${devices.length} devices`);
    
    devices.forEach(device => {
      if (!device || !device.ip_address) return;
      
      const ip = device.ip_address;
      const history = window.deviceHistoryData[ip] || [];
      const category = type.toUpperCase();
      
      console.log(`Device ${ip} (${type}): ${history.length} history entries`);
      
      const filteredHistory = filterHistoryForDisplay(history, category);
      const failureCount = filteredHistory.filter(e => e && e.status === 'Offline').length;
      
      if (failureCount > 0) {
        console.log(`→ ${ip}: ${failureCount} failures`);
      }
      
      // Map to appropriate category
      switch(type) {
        case 'cameras': counts.cameras += failureCount; break;
        case 'controllers': counts.controllers += failureCount; break;
        case 'archivers': counts.archivers += failureCount; break;
        case 'servers': counts.servers += failureCount; break;
        case 'pcDetails': counts.desktops += failureCount; break;
        case 'DBDetails': counts.dbServers += failureCount; break;
        default: console.warn(`Unknown device type: ${type}`);
      }
    });
  });

  console.log('FINAL DYNAMIC FAILURE COUNTS:', counts);
  return counts;
}