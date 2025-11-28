const allDevices = combinedDevices.map(item => item.card);
const deviceObjects = combinedDevices.map(item => item.device);



...
// Build offline city data
const offlineCityData = buildOfflineCityCount(combinedDevices);

console.log("Offline city data:", offlineCityData);