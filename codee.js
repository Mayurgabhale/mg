function shuffle(arr) {
  return arr
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

// Randomize the order so chart is not sorted
const randomized = shuffle(byLocation);

const labels = randomized.map(x => x.name || 'Unknown');
const values = randomized.map(x => x.count || 0);

chartInst.current = new Chart(ctx, {
  type: 'line',
  data: {
    labels,
    datasets: [{
      label: 'PIN rejections',
      data: values,
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37,99,235,0.2)',
      fill: true,
      tension: 0.3,
      pointBackgroundColor: '#2563eb',
      pointRadius: 5,
      pointHoverRadius: 7,
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { type: 'category' },
      y: { beginAtZero: true, ticks: { precision: 0 } }
    }
  }
});