callback: function (value, index) {
  return this.chart.data.labels[index];
},


...
color: function (context) {
  const index = context.index;
  const chart = context.chart;
  const details = chart.cityDetails?.[index];

  if (!details) return colors.text;

  if (details.risk === "High") return "#d32f2f";
  if (details.risk === "Medium") return "#fbc02d";
  return "#388e3c";  // Low now visible too
},

...


x: {
  ticks: {
    autoSkip: false,
    maxRotation: 0,
    minRotation: 0,

    callback: function (value, index) {
      return this.chart.data.labels[index];
    },

    color: function (context) {
      const index = context.index;
      const chart = context.chart;
      const details = chart.cityDetails?.[index];

      if (!details) return colors.text;

      if (details.risk === "High") return "#d32f2f";    // red
      if (details.risk === "Medium") return "#fbc02d";  // yellow
      return "#388e3c";                                 // green
    },

    font: function () {
      return { size: 12, weight: "bold" };
    }
  },

  grid: {
    color: colors.grid
  }
},