
async function updateMapData(summary, details) {
    if (!realMap || !details) return;

    const deviceBuckets = details.details || details;
    if (!deviceBuckets) return;

    const cityMap = {};
    Object.entries(deviceBuckets).forEach(([rawKey, arr]) => {
        if (!Array.isArray(arr)) return;
        arr.forEach(dev => {
            const cityName = (dev.city || dev.location || dev.site || "Unknown").trim();
            let lat = dev.lat || 0;
            let lon = dev.lon || 0;

            const type = (rawKey || "").toLowerCase().includes("camera") ? "camera" :
                         (rawKey || "").toLowerCase().includes("controller") ? "controller" :
                         (rawKey || "").toLowerCase().includes("server") ? "server" :
                         (rawKey || "").toLowerCase().includes("archiver") ? "archiver" : null;

            if (!cityMap[cityName]) cityMap[cityName] = {
                city: cityName,
                lat,
                lon,
                devices: { camera: 0, controller: 0, server: 0, archiver: 0 },
                total: 0,
                devicesList: []
            };

            if (type) cityMap[cityName].devices[type] += 1;
            cityMap[cityName].total += 1;
            cityMap[cityName].devicesList.push(dev);
        });
    });

    CITY_LIST = Object.values(cityMap);

    // Geocode cities with missing coordinates
    for (let c of CITY_LIST) {
        if (c.lat === 0 && c.lon === 0) {
            const coords = await getCityCoordinates(c.city);
            c.lat = coords[0];
            c.lon = coords[1];
        }
    }

    // Avoid overlapping city coordinates
    ensureUniqueCityCoordinates(CITY_LIST);

    // Place device markers
    CITY_LIST.forEach(c => {
        if (!cityLayers[c.city]) cityLayers[c.city] = { deviceLayer: L.layerGroup().addTo(realMap), summaryMarker: null };
        cityLayers[c.city].deviceLayer.clearLayers();
        _placeDeviceIconsForCity(c, c.devices, c.devicesList);
    });

    drawHeatmap();
    populateGlobalCityList();
}






function ensureUniqueCityCoordinates(cityArray) {
    const map = {};
    cityArray.forEach(c => {
        const key = `${c.lat.toFixed(6)}_${c.lon.toFixed(6)}`;
        if (!map[key]) map[key] = [];
        map[key].push(c);
    });

    Object.values(map).forEach(group => {
        if (group.length <= 1) return;
        const baseLat = group[0].lat;
        const baseLon = group[0].lon;
        if (baseLat === 0 && baseLon === 0) return;

        const radius = 0.02; // ~2km
        group.forEach((c, i) => {
            const angle = (2 * Math.PI * i) / group.length;
            c.lat = baseLat + Math.cos(angle) * radius;
            c.lon = baseLon + Math.sin(angle) * radius;
        });
    });
}







async function getCityCoordinates(cityName) {
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`);
        const data = await res.json();
        if (data && data.length > 0) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    } catch(err) {
        console.warn("Geocode failed for", cityName, err);
    }
    return [0, 0]; // fallback
}