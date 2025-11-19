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