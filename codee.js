      ok, good, but i want to dilsy __ in streght line __
not /// like 
x: {
  ticks: {
    display: true,
    autoSkip: false,
    callback: function(value, index) {
      const risk = riskLabels[index];

      // Show city name ONLY if risk is Medium or High
      if (risk === "Medium" || risk === "High") {
        return labels[index];
      }

      // Hide Low risk city labels
      return "";
    }
  },
  grid: {
    display: true
  }
}
