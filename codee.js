x: {
  ticks: {
    display: true,
    autoSkip: false,
    maxRotation: 0,
    minRotation: 0,

    callback: function (value, index) {
      const risk = riskLabels[index];

      if (risk === "Medium" || risk === "High") {
        return labels[index];
      }
      return "";
    },

    color: function (context) {
      const idx = context.index;
      const risk = riskLabels[idx];
      return (risk === "Medium" || risk === "High") ? "red" : "#666";
    }
  },
  grid: {
    display: true
  }
}