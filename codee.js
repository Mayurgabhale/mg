x: {
  ticks: {
    display: true,       // must be TRUE
    autoSkip: false,     // don't auto remove labels
    callback: function(value, index) {

      const risk = riskLabels[index];

      // Show ONLY Medium & High cities
      if (risk === "Medium" || risk === "High") {
        return labels[index];
      }

      // Hide Low risk city label
      return "";
    },
    font: function(context) {
      const idx = context.index;
      const risk = riskLabels[idx];

      // Make High risk bold
      if (risk === "High") {
        return { size: 12, weight: "bold" };
      }

      return { size: 10 };
    }
  },
  grid: {
    display: true
  }
}