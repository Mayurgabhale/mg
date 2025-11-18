/* Graphs section styling (dark/professional) */
.graphs-section {
  background: #0b0b0b;
  color: #e6eef7;
  padding: 22px;
  border-radius: 10px;
  margin: 12px 0;
}
.graphs-inner { max-width: 1200px; margin: 0 auto; }
.graphs-title {
  font-family: 'Poppins', sans-serif;
  color: #0ee08f;
  letter-spacing: 2px;
  margin: 6px 0 18px;
  font-weight: 700;
}

.graphs-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(260px, 1fr));
  gap: 18px;
}

/* Individual card */
.gcard {
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border: 1px solid rgba(255,255,255,0.04);
  padding: 14px;
  border-radius: 12px;
  box-shadow: 0 6px 22px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 180px;
}
.gcard-title {
  color: #cfeeed;
  font-size: 14px;
  margin: 0 0 6px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.gcanvas-wrap {
  height: 120px;           /* keep height for half-donut */
  display: flex;
  align-items: center;
  justify-content: center;
}
.gcard-foot {
  display:flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  font-size: 13px;
  color: #98a3a8;
}
.gcounts b { color: #fff; }
@media (max-width: 800px) {
  .graphs-grid { grid-template-columns: 1fr; }
}