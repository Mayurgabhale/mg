chartInst.current = new Chart(ctx, {
  type: 'line',
  data: {
    labels: labels,
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
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.parsed.y + ' cases';
          }
        }
      }
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } }
    }
  }
});