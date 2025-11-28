function normalizeCityName(city) {
  city = city.toLowerCase().trim();

  // Pune group
  if (city.startsWith("pune")) return "Pune";

  // Vilnius group
  if (city.includes("vilnius") || 
      city.includes("gama") || 
      city.includes("delta")) {
    return "Vilnius";
  }

  // Default – return as-is (capitalized first letter)
  return city.charAt(0).toUpperCase() + city.slice(1);
}


..