document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    renderTotalCountChart();
  }, 200); // wait for DOM totals to load
});






...
labels: {
  usePointStyle: true,
  padding: 12,
  color: getComputedStyle(document.body)
          .getPropertyValue('--graph-card-title-dark'),

  generateLabels: function (chart) {
    const dataset = chart.data.datasets[0];
    const labels = chart.data.labels;
    const colors = dataset.backgroundColor;

    return labels.map((label, i) => ({
      text: `${label} - ${dataset.data[i]}`,
      fillStyle: colors[i],
      strokeStyle: colors[i],
      fontColor: getComputedStyle(document.body)
                    .getPropertyValue('--graph-card-title-dark'),
      hidden: false,
      index: i
    }));
  }
}