async function getMapData(region = "global") {
    const res = await fetch(`${baseUrl}/details/${region}`);
    const data = await res.json();
    return data; // raw data, no summary, no UI updates
}

window.getMapData = getMapData;