x: {
  ticks: {
    display: true,
    autoSkip: false,

    // MAKE TEXT WHITE
    color: "#ffffff",

    // FORCE straight text
    maxRotation: 0,
    minRotation: 0,

    callback: function (value, index) {
      const risk = riskLabels[index];

      // Show ONLY Medium & High
      if (risk === "Medium" || risk === "High") {
        return labels[index];
      }

      return "";   // Hide Low risk city labels
    },

    font: function (context) {
      const idx = context.index;
      const risk = riskLabels[idx];

      // Highlight HIGH risk names
      if (risk === "High") {
        return { size: 12, weight: "bold" };
      }

      return { size: 10 };
    }
  },

  grid: {
    display: true,
    color: "rgba(255,255,255,0.2)"   // optional: white grid lines
  }
}