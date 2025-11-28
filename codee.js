const allDevices = combinedDevices.map(item => item.card);
const deviceObjects = combinedDevices.map(item => item.device);

// ================= STEP 1: Build offline city data =================
const offlineCityData = buildOfflineCityCount(combinedDevices);

// ================= STEP 2: Convert for map =================
const mapCityData = convertOfflineCityForMap(offlineCityData);

// ================= STEP 3: Send to map =================
if (typeof updateOfflineMap === "function") {
    updateOfflineMap(mapCityData);
}

...


const mapCityData = convertOfflineCityForMap(offlineCityData);

// send to map
if (typeof updateOfflineMap === "function") {
    updateOfflineMap(mapCityData);
}

...

.



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