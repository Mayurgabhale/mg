offlineCityBarChart.data.datasets[0].backgroundColor = details.map(d => {
  if (d.risk === "High") return "#d32f2f";    // red
  if (d.risk === "Medium") return "#fbc02d";  // yellow
  return "#388e3c";                           // green
});