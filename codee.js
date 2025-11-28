const allDevices = combinedDevices.map(item => item.card);
const deviceObjects = combinedDevices.map(item => item.device);



...
// Build offline city data
const offlineCityData = buildOfflineCityCount(combinedDevices);

console.log("Offline city data:", offlineCityData);


...
function convertOfflineCityForMap(offlineCities) {
    return offlineCities.map(city => ({
        city: city.city,
        offlineDevices: city.offline,
        totalOffline: Object.values(city.offline).reduce((a, b) => a + b, 0)
    }));
}