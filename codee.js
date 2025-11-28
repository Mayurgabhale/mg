x: {
  ticks: {
    autoSkip: false,
    maxRotation: 0,
    minRotation: 0,

    callback: function (value, index) {
      const chart = this.chart;
      const details = chart.cityDetails?.[index];

      // Show label ONLY for High and Medium
      if (!details || details.risk === "Low") {
        return "";
      }

      return details.city;
    },

    color: function (context) {
      const index = context.index;
      const chart = context.chart;
      const details = chart.cityDetails?.[index];

      if (!details) return "#333";

      if (details.risk === "High") return "#d32f2f";    // red
      if (details.risk === "Medium") return "#fbc02d";  // yellow

      return "transparent"; // hide Low city label
    },

    font: function (context) {
      const index = context.index;
      const chart = context.chart;
      const details = chart.cityDetails?.[index];

      if (!details || details.risk === "Low") {
        return { size: 0 };  // Fully hide low labels
      }

      return { size: 12, weight: "bold" };
    }
  },
  grid: {
    color: "#ddd"
  }
},