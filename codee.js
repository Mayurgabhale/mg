/* Total Count pie sizing — reuse same look as Weekly Failures */
.gcard.wide .chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  box-sizing: border-box;
  min-height: 160px; /* adjusts by breakpoints already in your CSS */
  width: 100%;
}

/* canvas should fill placeholder responsively */
.gcard.wide .chart-placeholder canvas {
  width: 100% !important;
  height: 100% !important;
  max-width: 420px;    /* keeps it from growing too large on desktops */
  max-height: 360px;
}







..
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>