x: {
  ticks: {
    display: true,
    autoSkip: false,

    // FORCE straight text (no slant)
    maxRotation: 0,
    minRotation: 0,

    callback: function(value, index) {
      const risk = riskLabels[index];

      // Show only Medium & High
      if (risk === "Medium" || risk === "High") {
        return labels[index];
      }
      return "";
    },

    font: function(context) {
      const idx = context.index;
      const risk = riskLabels[idx];

      // Bold High risk cities
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