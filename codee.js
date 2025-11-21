??' and '||' operations cannot be mixed without parentheses.ts(5076)
any

plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              return `${ctx.label} : ${ctx .parsed.y ?? ctx.parsed || 0}`;
            }
          }
        }
      }
    },
