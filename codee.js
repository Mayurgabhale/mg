let failureChart = null;

function createFailureCountChart() {
  const canvas = document.getElementById('failureCountChart');
  if (!canvas) {
    console.error("Canvas not found!");
    return;
  }

  const ctx = canvas.getContext('2d');

  failureChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Failure Count',
        data: [],  // Will come dynamically
        backgroundColor: '#00ffcc',
        borderColor: '#00ffcc',
        pointRadius: 7,
        pointHoverRadius: 9
      }]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          labels: {
            color: '#00ffcc'
          }
        },
        title: {
          display: true,
          text: 'FAILURE COUNT',
          color: '#00ffcc',
          font: { size: 16 }
        }
      },

      scales: {
        x: {
          title: {
            display: true,
            text: 'Device Index',
            color: '#00ffcc'
          },
          ticks: { color: '#00ffcc' },
          grid: { color: 'rgba(0,255,204,0.1)' }
        },

        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Failure Count',
            color: '#00ffcc'
          },
          ticks: { color: '#00ffcc' },
          grid: { color: 'rgba(0,255,204,0.1)' }
        }
      }
    }
  });
}


function refreshFailureChart(failureData) {
  if (!failureChart) {
    createFailureCountChart();
  }

  const scatterData = [
    { x: 1, y: failureData.cameras },
    { x: 2, y: failureData.controllers },
    { x: 3, y: failureData.archivers },
    { x: 4, y: failureData.servers },
    { x: 5, y: failureData.desktops },
    { x: 6, y: failureData.dbServers }
  ];

  failureChart.data.datasets[0].data = scatterData;
  failureChart.update();
}