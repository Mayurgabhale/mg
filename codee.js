plugins: {
  legend: { display: false },
  tooltip: {
    callbacks: {
      label: function (ctx) {
        const value = ctx.parsed?.y ?? 0;
        return `${ctx.label} : ${value}`;
      }
    }
  }
}