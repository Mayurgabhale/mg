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