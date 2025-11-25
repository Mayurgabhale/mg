const centerTextPlugin = {
  id: 'centerText',
  afterDatasetsDraw(chart) {   // ✅ better than afterDraw
    const { ctx, chartArea, data } = chart;

    if (!chartArea) return;    // ✅ prevents crash on first render

    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;

    // ✅ fresh total calculation every time
    const total = data.datasets[0].data.reduce((a, b) => a + b, 0);

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // ✅ Safe color fallback
    const labelColor = getComputedStyle(document.body)
        .getPropertyValue('--graph-card-footer-dark')
        .trim() || "#888";  // fallback gray

    const valueColor = getComputedStyle(document.body)
        .getPropertyValue('--graph-card-title-dark')
        .trim() || "#ffffff"; // fallback white

    // TOTAL label
    ctx.font = "14px Arial";
    ctx.fillStyle = labelColor;
    ctx.fillText("TOTAL", centerX, centerY - 20);

    // TOTAL value
    ctx.font = "bold 22px Arial";
    ctx.fillStyle = valueColor;
    ctx.fillText(total.toString(), centerX, centerY + 15);

    ctx.restore();
  }
};