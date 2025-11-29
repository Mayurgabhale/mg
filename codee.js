chartInst.current = new Chart(ctx, {
  type: 'line',    // change bar → line
  data: {
    labels,
    datasets: [{
      label: 'PIN rejections',
      data: values,
      borderWidth: 2,
      fill: false,
      tension: 0.3,   // smooth line
      borderColor: 'rgba(37,99,235,0.9)',
      pointBackgroundColor: 'rgba(37,99,235,0.9)'
    }]
  },
  options: {
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { 
      y: { beginAtZero: true, ticks: { precision:0 } }
    }
  }
});