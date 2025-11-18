i want to same css for graph sectin this is my privius code ok use this just blakc and lihg them do for this ok 
  give me ony this css ony light and dark theme ok 
 /* overall section */
.graphs-section {
  background: #0a0a0a;
 
  color: #e6eef7;
  padding: 22px;
  border-radius: 12px;
  margin: 12px 0;
  font-family: 'Poppins', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  box-shadow: 0 6px 24px rgba(0,0,0,0.6);
}

/* header */
.graphs-title {
  color: #2ef07f;
  font-size: 20px;
  margin-bottom: 14px;
  letter-spacing: 2px;
}


.graphs-grid.dashboard-layout {
  display: grid;
  grid-template-columns: 1fr 900px; 
  /* gap: 18px; */
}


/* left area is its own grid to form 2x2 cards */
.left-grid {
  display: grid;
  /* grid-template-columns: repeat(2, minmax(260px, 1fr)); */
  grid-template-columns: repeat(2, minmax(390px, 1fr));
  gap: 18px;
}

/* right panel */
.right-panel .gcard.tall {
  height: calc(100% + 0px);
  display: flex;
  flex-direction: column;
}

/* bottom row (spans full width below left + right) */
/* place bottom row after main grid using a second grid inside left-column area */
.bottom-row {
  grid-column: 1 / -1; /* spans both columns */
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-top: 12px;
}

/* general card */
.gcard {
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border: 1px solid rgba(255,255,255,0.04);
  padding: 14px;
  border-radius: 12px;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
}

/* card title */
.gcard-title {
  font-size: 13px;
  color: #cfeeed;
  /* color: #f6b43a; */
  margin: 0 0 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* small footer row in the card */
.gcard-foot.small {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  color: #98a3a8;
  /* color: #f6b43a; */
  font-size: 12px;
}

/* placeholders for charts & map */
.map-placeholder {
  background: #060606;
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
  color: #b8f4c9;
  font-weight: 600;
}

/* simple annotation boxes for map example */
.map-annot {
  background: rgba(0,0,0,0.45);
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.04);
  font-size: 12px;
  text-align: center;
}

/* chart placeholders */
.chart-placeholder {
  height: 120px;
  /* background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.02)); */
  border-radius: 8px;
  margin-top: 8px;
}

/* ================= Semi Donut (dashboard smaller sizing) =============== */



.semi-donut {
  --percentage: 0;
  --active: #12b76a;      
  --inactive: #f6b43a;   
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


/* inside text */
.gtext {
  position: absolute;
  bottom: 8px;
  text-align: center;
  /* color: #dfffe9; */
  color: #f6b43a;
}

.gtext .total {
  font-size: 20px;
  color: #0ee08f;
  display: block;
}

.gtext small {
  font-size: 12px;
  color: #98a3a8;
  display: block;
}

/* responsive */
@media (max-width: 1100px) {
  .graphs-grid.dashboard-layout { grid-template-columns: 1fr; }
  .left-grid { grid-template-columns: 1fr 1fr; }
  .bottom-row { grid-template-columns: 1fr; }
}
