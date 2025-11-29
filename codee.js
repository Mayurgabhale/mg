i want line chart desin like this

          chartInst.current = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: 'Flagged by Risk Level',
                data: values,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37,99,235,0.2)',
                fill: true,
                tension: 0.3,
                pointBackgroundColor: colors,
                pointRadius: 5,
                pointHoverRadius: 7
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
              onClick: function (evt, elements) {
                if (elements && elements.length > 0) {
                  var idx = elements[0].index;
                  var label = this.data.labels[idx];
                  handleRiskBarClick(label);
                }
              },
              scales: {
                y: { beginAtZero: true, ticks: { precision: 0 } }
              }
            }
          });

        }
-----------
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
