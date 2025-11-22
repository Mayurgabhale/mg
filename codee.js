/* Ensure Failure Count chart container is visible */
.gcard.wide {
  position: relative;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
}

#failureCountChart {
  width: 100% !important;
  height: 100% !important;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  z-index: 10 !important;
  position: relative !important;
}

/* Ensure the graphs section is properly styled */
.graphs-section {
  position: relative;
  z-index: 1;
}

.bottom-row {
  position: relative;
  z-index: 1;
}

/* Make sure canvas is not hidden */
canvas {
  display: block !important;
  visibility: visible !important;
}
