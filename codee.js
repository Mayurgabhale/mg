function createFailureCountChart() {
  const ctx = document.getElementById('failureCountChart');
  if (!ctx) {
    console.error('FAILURE COUNT CHART: Canvas not found');
    return null;
  }

  const categories = ['CCTV', 'ACS', 'NVR/DVR', 'SERVER', 'PC', 'DB'];

  failureChart = new Chart(ctx.getContext('2d'), {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Failures',
          data: [
            { x: 3, y: 40 },
            { x: 9, y: 90 },
            { x: 12, y: 120 },
            { x: 18, y: 160 },
            { x: 20, y: 110 }
          ],
          backgroundColor: [
            '#ff5252',
            '#00e676',
            '#ffca28',
            '#40c4ff',
            '#e040fb'
          ],
          borderColor: '#00ffcc',
          borderWidth: 1,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          labels: {
            color: '#00ffcc',
            font: { size: 12 }
          }
        }
      },

      scales: {
        x: {
          grid: { color: 'rgba(0,255,204,0.1)' },
          ticks: { color: '#00ffcc' },
          title: {
            display: true,
            text: 'Time / Index',
            color: '#00ffcc'
          }
        },
        y: {
          grid: { color: 'rgba(0,255,204,0.1)' },
          ticks: { color: '#00ffcc' },
          title: {
            display: true,
            text: 'Failure Count',
            color: '#00ffcc'
          }
        }
      }
    }
  });

  return failureChart;
}