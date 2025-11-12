// ✅ Apply region filter if a region card is clicked
const regionFiltered = selectedRegion
    ? processed.filter((r) => {
        const region = getRegionForCountry(r.to_country || r.from_country || ""); // helper maps country → region
        return region === selectedRegion;
      })
    : processed;