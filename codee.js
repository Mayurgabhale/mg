/* Graph Section - Dark/Light Theme */
:root {
  /* Dark Theme Colors */
  --graph-bg-dark: #0a0a0a;
  --graph-text-dark: #e6eef7;
  --graph-title-dark: #2ef07f;
  --graph-card-bg-dark: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  --graph-card-border-dark: rgba(255,255,255,0.04);
  --graph-card-title-dark: #cfeeed;
  --graph-card-footer-dark: #98a3a8;
  --graph-map-bg-dark: #060606;
  --graph-map-text-dark: #b8f4c9;
  --graph-map-annot-bg-dark: rgba(0,0,0,0.45);
  --graph-map-annot-border-dark: rgba(255,255,255,0.04);
  --graph-gauge-active: #12b76a;
  --graph-gauge-inactive: #f6b43a;
  --graph-gauge-total: #0ee08f;
  --graph-gauge-text: #f6b43a;
  --graph-shadow-dark: rgba(0,0,0,0.6);
}

.theme-light {
  /* Light Theme Colors */
  --graph-bg-light: #f8fafc;
  --graph-text-light: #1e293b;
  --graph-title-light: #059669;
  --graph-card-bg-light: linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01));
  --graph-card-border-light: rgba(0,0,0,0.08);
  --graph-card-title-light: #374151;
  --graph-card-footer-light: #6b7280;
  --graph-map-bg-light: #ffffff;
  --graph-map-text-light: #059669;
  --graph-map-annot-bg-light: rgba(0,0,0,0.05);
  --graph-map-annot-border-light: rgba(0,0,0,0.1);
  --graph-gauge-active: #10b981;
  --graph-gauge-inactive: #d97706;
  --graph-gauge-total: #059669;
  --graph-gauge-text: #d97706;
  --graph-shadow-light: rgba(0,0,0,0.1);
}

/* Overall section */
.graphs-section {
  background: var(--graph-bg-dark);
  color: var(--graph-text-dark);
  padding: 22px;
  border-radius: 12px;
  margin: 12px 0;
  font-family: 'Poppins', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  box-shadow: 0 6px 24px var(--graph-shadow-dark);
}

.theme-light .graphs-section {
  background: var(--graph-bg-light);
  color: var(--graph-text-light);
  box-shadow: 0 6px 24px var(--graph-shadow-light);
}

/* Header */
.graphs-title {
  color: var(--graph-title-dark);
  font-size: 20px;
  margin-bottom: 14px;
  letter-spacing: 2px;
  font-weight: 700;
}

.theme-light .graphs-title {
  color: var(--graph-title-light);
}

.graphs-grid.dashboard-layout {
  display: grid;
  grid-template-columns: 1fr 900px;
}

/* Left area is its own grid to form 2x2 cards */
.left-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(390px, 1fr));
  gap: 18px;
}

/* Right panel */
.right-panel .gcard.tall {
  height: calc(100% + 0px);
  display: flex;
  flex-direction: column;
}

/* Bottom row (spans full width below left + right) */
.bottom-row {
  grid-column: 1 / -1; /* spans both columns */
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-top: 12px;
}

/* General card */
.gcard {
  background: var(--graph-card-bg-dark);
  border: 1px solid var(--graph-card-border-dark);
  padding: 14px;
  border-radius: 12px;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  transition: all 0.3s ease;
}

.theme-light .gcard {
  background: var(--graph-card-bg-light);
  border: 1px solid var(--graph-card-border-light);
}

.gcard:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px var(--graph-shadow-dark);
}

.theme-light .gcard:hover {
  box-shadow: 0 8px 25px var(--graph-shadow-light);
}

/* Card title */
.gcard-title {
  font-size: 13px;
  color: var(--graph-card-title-dark);
  margin: 0 0 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.theme-light .gcard-title {
  color: var(--graph-card-title-light);
}

/* Small footer row in the card */
.gcard-foot.small {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  color: var(--graph-card-footer-dark);
  font-size: 12px;
}

.theme-light .gcard-foot.small {
  color: var(--graph-card-footer-light);
}

/* Placeholders for charts & map */
.map-placeholder {
  background: var(--graph-map-bg-dark);
  border-radius: 8px;
  height: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 12px;
  position: relative;
  color: var(--graph-map-text-dark);
  font-weight: 600;
}

.theme-light .map-placeholder {
  background: var(--graph-map-bg-light);
  color: var(--graph-map-text-light);
}

/* Simple annotation boxes for map example */
.map-annot {
  background: var(--graph-map-annot-bg-dark);
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid var(--graph-map-annot-border-dark);
  font-size: 12px;
  text-align: center;
}

.theme-light .map-annot {
  background: var(--graph-map-annot-bg-light);
  border: 1px solid var(--graph-map-annot-border-light);
}

/* Chart placeholders */
.chart-placeholder {
  height: 120px;
  border-radius: 8px;
  margin-top: 8px;
  background: var(--graph-map-bg-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--graph-map-text-dark);
  font-weight: 600;
}

.theme-light .chart-placeholder {
  background: var(--graph-map-bg-light);
  color: var(--graph-map-text-light);
}

/* ================= Semi Donut (dashboard smaller sizing) =============== */
.semi-donut {
  --percentage: 0;
  --active: var(--graph-gauge-active);
  --inactive: var(--graph-gauge-inactive);
  width: 300px;
  height: 150px;
  position: relative;
  font-size: 22px;
  font-weight: 600;
  overflow: hidden;
  color: var(--active);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  box-sizing: border-box;
}

/* Half circle background + fill */
.semi-donut::after {
  content: '';
  width: 300px;
  height: 300px;
  border: 50px solid;
  border-color: var(--inactive) var(--inactive) var(--active) var(--active);
  position: absolute;
  border-radius: 50%;
  left: 0;
  top: 0;
  transform: rotate(calc(-45deg + var(--percentage) * 1.8deg));
  animation: fillAnimation 1s ease-in;
  box-sizing: border-box;
}

@keyframes fillAnimation {
  from { transform: rotate(-45deg); }
  to { transform: rotate(calc(-45deg + var(--percentage) * 1.8deg)); }
}

/* Inside text */
.gtext {
  position: absolute;
  bottom: 8px;
  text-align: center;
  color: var(--graph-gauge-text);
}

.gtext .total {
  font-size: 20px;
  color: var(--graph-gauge-total);
  display: block;
}

.gtext small {
  font-size: 12px;
  color: var(--graph-card-footer-dark);
  display: block;
}

.theme-light .gtext small {
  color: var(--graph-card-footer-light);
}

/* Responsive */
@media (max-width: 1100px) {
  .graphs-grid.dashboard-layout { 
    grid-template-columns: 1fr; 
  }
  .left-grid { 
    grid-template-columns: 1fr 1fr; 
  }
  .bottom-row { 
    grid-template-columns: 1fr; 
  }
}

@media (max-width: 768px) {
  .graphs-section {
    padding: 16px;
  }
  
  .left-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .semi-donut {
    width: 250px;
    height: 125px;
  }
  
  .semi-donut::after {
    width: 250px;
    height: 250px;
    border-width: 40px;
  }
}

@media (max-width: 480px) {
  .graphs-section {
    padding: 12px;
  }
  
  .graphs-title {
    font-size: 18px;
  }
  
  .semi-donut {
    width: 200px;
    height: 100px;
  }
  
  .semi-donut::after {
    width: 200px;
    height: 200px;
    border-width: 30px;
  }
  
  .gtext .total {
    font-size: 18px;
  }
  
  .gtext small {
    font-size: 10px;
  }
}