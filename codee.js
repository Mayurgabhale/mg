function computeCityRiskLevel(city) {
  if (!city || !city.offline) return { label: "Low", color: "#16A34A" };

  const cam = city.offline.camera || 0;
  const arch = city.offline.archiver || 0;
  const srv = city.offline.server || 0;
  const ctrl = city.offline.controller || 0;

  const othersOffline = (arch > 0 || srv > 0 || ctrl > 0);

  // Case 1: Only cameras offline → MEDIUM
  if (cam > 0 && !othersOffline) {
    return { label: "Medium", color: "#FACC15" };
  }

  // Case 2: Camera + any other device offline → HIGH
  if (cam > 0 && othersOffline) {
    return { label: "High", color: "#DC2626" };
  }

  // Case 3: Everything else → LOW
  return { label: "Low", color: "#16A34A" };
}







...
const riskInfo = CITY_LIST.map(c => computeCityRiskLevel(c));