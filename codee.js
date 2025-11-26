// add this entry (or modify existing) inside CITY_COORDS
  "Vilnius": [54.6872, 25.2797],
  "Pune": [18.5204, 73.8567],
  // keep Pune sub-entries if you want, but mapping will normalize them:
  "Pune 2nd Floor": [18.5204, 73.8567],
  "Pune Podium": [18.5204, 73.8567],
  "Pune Tower B": [18.5204, 73.8567],




// ---------- ADD THIS (after CITY_COORDS) ----------
const CITY_PARENT_PATTERNS = [
  { patterns: [/^vilnius\b/i, /gama building/i, /delta building/i], parent: "Vilnius" },
  { patterns: [/^pune\b/i, /\bpune\b/i, /pune 2nd floor/i, /pune podium/i, /pune tower/i], parent: "Pune" }
];

function normalizeCityForMap(rawName) {
  if (!rawName) return "Unknown";
  const name = String(rawName).trim();

  for (const rule of CITY_PARENT_PATTERNS) {
    for (const p of rule.patterns) {
      if (p.test(name)) return rule.parent;
    }
  }

  if (name.includes(" - ")) return name.split(" - ")[0].trim();
  if (name.includes(",")) return name.split(",")[0].trim();
  return name;
}

// Ensure Vilnius coords exist (add if missing)
if (!CITY_COORDS["Vilnius"]) {
  CITY_COORDS["Vilnius"] = [54.6872, 25.2797];
}
if (!CITY_COORDS["Pune"]) {
  CITY_COORDS["Pune"] = [18.5204, 73.8567];
}

// ---------- END ADD ----------


// old:
// const cityNameRaw = dev.city || dev.location || dev.site || "Unknown";
// const cityName = (typeof cityNameRaw === 'string') ? cityNameRaw.trim() : String(cityNameRaw);
// let lat = toNum(dev.lat);
// let lon = toNum(dev.lon);

// new:
const cityNameRaw = dev.city || dev.location || dev.site || "Unknown";
let cityNameCandidate = (typeof cityNameRaw === 'string') ? cityNameRaw.trim() : String(cityNameRaw);
const cityName = normalizeCityForMap(cityNameCandidate);
let lat = toNum(dev.lat);
let lon = toNum(dev.lon);