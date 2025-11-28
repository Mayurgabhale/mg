function normalizeCityForMap(rawName) {
  // Prefer the normalizeCityName from graph.js if present (single source of truth)
  if (typeof window.normalizeCityName === 'function') {
    try {
      return window.normalizeCityName(String(rawName || "Unknown"));
    } catch (e) {
      console.warn("normalizeCityName failed, falling back:", e);
    }
  }

  // fallback logic (your original)
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