const riskInfo = CITY_LIST.map(c => computeCityRisk(c));




function computeCityRisk(city) {
  if (!city || !city.offline) {
    return { label: "Low", color: "#16A34A" };
  }

  const cam = city.offline.camera || 0;
  const arch = city.offline.archiver || 0;
  const srv = city.offline.server || 0;   // CCURE
  const ctrl = city.offline.controller || 0;

  const camerasOffline = cam > 0;
  const otherOffline = (arch > 0 || srv > 0 || ctrl > 0);

  // RULE 1: Only Cameras offline → Medium
  if (camerasOffline && !otherOffline) {
    return { label: "Medium", color: "#FACC15" };
  }

  // RULE 2: Cameras + Others offline → High
  if (camerasOffline && otherOffline) {
    return { label: "High", color: "#DC2626" };
  }

  // RULE 3: Only Archiver / Controller / CCURE offline → High
  if (!camerasOffline && otherOffline) {
    return { label: "High", color: "#DC2626" };
  }

  // RULE 4: Nothing offline → Low
  return { label: "Low", color: "#16A34A" };
}