create cprrect chcart ok
// Enhanced Failure Count Chart with real data
// function createFailureCountChart() {
//   const ctx = document.getElementById('failureCountChart');
//   if (!ctx) {
//     console.error('FAILURE COUNT CHART: Canvas element not found!');
//     return null;
//   }
  
//   console.log('FAILURE COUNT CHART: Creating chart...');
  
//   // Ensure canvas is visible
//   ctx.style.display = 'block';
//   ctx.style.visibility = 'visible';
//   ctx.style.opacity = '1';
//   ctx.style.width = '100%';
//   ctx.style.height = '100%';
  
//   failureChart = new Chart(ctx.getContext('2d'), {
//     type: 'bar',
//     data: {
//       labels: ['Cameras', 'Controllers', 'Archivers', 'Servers', 'Desktops', 'DB Servers'],
//       datasets: [{
//         label: 'Total Failures',
//         data: [0, 0, 0, 0, 0, 0],
//         backgroundColor: [
//           '#ff6b6b',
//           '#4ecdc4', 
//           '#45b7d1',
//           '#96ceb4',
//           '#ffa726',
//           '#ffee58'
//         ],
//         borderColor: [
//           '#ff5252',
//           '#26a69a',
//           '#29b6f6', 
//           '#81c784',
//           '#ff9800',
//           '#fdd835'
//         ],
//         borderWidth: 2,
//         borderRadius: 6
//       }]
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       layout: {
//         padding: {
//           top: 20,
//           right: 20,
//           bottom: 20,
//           left: 20
//         }
//       },
//       plugins: {
//         legend: {
//           display: true,
//           position: 'top',
//         },
//         title: {
//           display: true,
//           text: 'Device Failure Count',
//           font: {
//             size: 16,
//             weight: 'bold'
//           },
//           padding: 2
//         },
//         tooltip: {
//           callbacks: {
//             label: function(context) {
//               return `${context.label}: ${context.parsed.y} failures`;
//             }
//           }
//         }
//       },
//       scales: {
//         y: {
//           beginAtZero: true,
//           title: {
//             display: true,
//             text: 'Number of Failures',
//             font: {
//               weight: 'bold'
//             }
//           },
//           ticks: {
//             precision: 0,
//             stepSize: 1
//           },
//           grid: {
//             color: 'rgba(0,0,0,0.1)'
//           }
//         },
//         x: {
//           ticks: {
//             autoSkip: false,
//             // maxRotation: 45,
//             // minRotation: 45
//           },
//           grid: {
//             display: false
//           }
//         },
//         x: {
//           ticks: {
//             autoSkip: false,
//             // maxRotation: 45,
//             // minRotation: 45
//           },
//           grid: {
//             display: false
//           }
//         }
//       },
//       animation: {
//         duration: 1000,
//         easing: 'easeInOutQuart'
//       }
//     }
//   });

//   console.log('FAILURE COUNT CHART: Chart created successfully');
//   return failureChart;
// }


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

refreshFailureChart({
  cameras: 15,
  controllers: 8,
  archivers: 20,
  servers: 5,
  desktops: 10,
  dbServers: 3
});




failureChart.data.datasets[0].data = [
  { x: 2, y: 15 },
  { x: 6, y: 8 },
  { x: 10, y: 20 },
  { x: 14, y: 5 },
  { x: 18, y: 10 },
  { x: 22, y: 3 }
];
