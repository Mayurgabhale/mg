
.graphs-grid.dashboard-layout { align-items: start; grid-auto-rows: auto; }
.left-grid, .left-grid .gcard { align-self: start; }
.right-panel .gcard.tall { height: auto; min-height: 700px; display:flex; flex-direction:column; }
.right-panel .map-placeholder { min-height: 660px; }



....



/* Right MAP PANEL – independent height */
.right-panel .gcard.tall {
  height: auto;          /* remove row sync */
  min-height: 700px;     /* set your desired map height */
  display: flex;
  flex-direction: column;
}

/* Map container */
.map-placeholder {
  min-height: 600px !important;  /* adjust freely */
}