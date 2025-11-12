const [selectedRegion, setSelectedRegion] = useState(null);



.....

{Object.entries(regionsData || {})
    .sort(([a], [b]) => {
        if (a === 'GLOBAL') return -1;
        if (b === 'GLOBAL') return 1;
        return a.localeCompare(b);
    })
    .map(([regionCode, regionData]) => (
        <div
            key={regionCode}
            onClick={() => setSelectedRegion(regionCode)}  // ✅ make clickable
            style={{
                ...styles.regionCard,
                cursor: "pointer",
                border: selectedRegion === regionCode ? "2px solid #3b82f6" : "1px solid #e5e7eb",
                boxShadow: selectedRegion === regionCode ? "0 0 10px rgba(59,130,246,0.4)" : "none",
            }}
        >

...
...


const filtered = safeItems.filter(r => {
    const region = getRegionForCountry(r.to_country || r.from_country || ""); // or your region resolver
    return !selectedRegion || region === selectedRegion;
});




...


const regionFiltered = filtered.filter(r => {
    const region = getRegionForCountry(r.to_country || r.from_country || "");
    return !selectedRegion || region === selectedRegion;
});



...
..
{regionFiltered.map((r, i) => (
    ...
))}




