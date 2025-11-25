options: {
  responsive: true,
  maintainAspectRatio: false,

  cutout: '55%',  // keep hole size same
  radius: '65%',  // ✅ shrink only circle size

  plugins: {
    legend: {
      position: 'right',
      labels: { ... }
    },
    tooltip: { ... }
  }
}