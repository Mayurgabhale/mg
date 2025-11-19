async function updateMapData(summary, details) {
    if (!realMap || !details) return;

    const deviceBuckets = details.details || details;
    if (!deviceBuckets) return;

    const cityMap = {};
    Object.entries(deviceBuckets).forEach(([rawKey, arr]) => {
        if (!Array.isArray(arr)) return;
        arr.forEach(dev => {
            const cityName = (dev.city || dev.location || dev.site || "Unknown").trim();
            const region = dev.region || "Unknown";
            let lat = dev.lat || 0;
            let lon = dev.lon || 0;

            const type = (rawKey || "").toLowerCase().includes("camera") ? "camera" :
                         (rawKey || "").toLowerCase().includes("controller") ? "controller" :
                         (rawKey || "").toLowerCase().includes("server") ? "server" :
                         (rawKey || "").toLowerCase().includes("archiver") ? "archiver" : null;

            if (!cityMap[cityName]) cityMap[cityName] = {
                city: cityName,
                region,
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

    // Geocode cities that have lat/lon = 0
    for (let c of CITY_LIST) {
        if (c.lat === 0 && c.lon === 0) {
            const coords = await getCityCoordinates(c.city); // Use Nominatim
            c.lat = coords[0];
            c.lon = coords[1];
        }

        if (!cityLayers[c.city]) cityLayers[c.city] = { deviceLayer: L.layerGroup().addTo(realMap), summaryMarker: null };
        _placeDeviceIconsForCity(c, c.devices, c.devicesList);

        const icon = _renderCitySummary(c, c.devices);
        if (cityLayers[c.city].summaryMarker)
            cityLayers[c.city].summaryMarker.setIcon(icon);
        else
            cityLayers[c.city].summaryMarker = L.marker([c.lat, c.lon], { icon }).addTo(realMap)
                .on("click", () => { realMap.flyTo([c.lat, c.lon], 7); populateCityPanel(c.city); });
    }

    drawHeatmap();
    drawRegionBadges();
    populateGlobalCityList();
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