<!-- Temporary debug button - remove after testing -->
<div style="position: fixed; top: 80px; right: 20px; z-index: 10000; background: #ff6b6b; padding: 10px; border-radius: 5px;">
  <button onclick="testFailureChart()" style="background: white; color: #ff6b6b; border: none; padding: 8px 12px; border-radius: 3px; cursor: pointer; font-weight: bold;">
    Test Failure Chart
  </button>
  <button onclick="console.log('Failure Chart:', failureChart); console.log('Device History:', window.deviceHistoryData); console.log('Current Details:', window.currentDeviceDetails)" 
          style="background: #45b7d1; color: white; border: none; padding: 8px 12px; border-radius: 3px; cursor: pointer; margin-left: 5px;">
    Debug Info
  </button>
</div>





...
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
