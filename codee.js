/* ===========================
   Responsive-only overrides
   (append to the end of graph.css)
   =========================== */

/* Make graphs-section use auto height on small screens */
@media (max-width: 1200px) {
  .graphs-section {
    height: auto !important;      /* don't force full viewport height on smaller screens */
    padding: 18px 12px;
  }

  /* Stack layout: single column for main grid */
  .graphs-grid.dashboard-layout {
    grid-template-columns: 1fr !important;
    gap: 12px;
  }

  /* Right panel & map become full-width stacked block */
  .right-panel {
    width: 100%;
    flex: none;
    order: 2;
  }

  .worldmap-wrapper {
    flex-direction: column;
    gap: 12px;
  }

  /* Make map card use full available width */
  .worldmap-card {
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
  }

  /* Responsive map height using viewport fraction */
  #realmap {
    /* prefer aspect-ratio in modern browsers */
    aspect-ratio: 16 / 9;
    height: auto;
    min-height: 220px;
  }

  /* chart placeholders smaller on medium screens */
  .chart-placeholder {
    min-height: 220px;
  }

  /* bottom row stacks */
  .bottom-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  /* make cards more compact */
  .gcard {
    padding: 10px;
  }
}

/* Smaller tablets / large phones */
@media (max-width: 900px) {
  .graphs-section {
    padding: 14px 10px;
  }

  /* Left grid becomes single column */
  .left-grid {
    grid-template-columns: 1fr !important;
    gap: 10px;
  }

  /* Semi-donut scales down */
  .semi-donut {
    width: min(90%, 260px);
    height: calc(var(--semi-donut-height, 150px) * 0.85);
  }
  .semi-donut::after {
    width: calc(min(90%, 260px) * 1);
    height: calc(min(90%, 260px) * 1);
    border-width: calc(40px * 0.85);
  }

  /* map height a bit taller for readability on narrow screens */
  #realmap {
    min-height: 260px;
  }
}

/* Phones and very small screens */
@media (max-width: 480px) {
  .graphs-section {
    padding: 10px 8px;
  }

  /* tighten gaps and text sizes */
  .graphs-grid.dashboard-layout {
    gap: 8px;
  }

  .gcard {
    padding: 8px;
  }

  .gcard-title {
    font-size: 12px;
  }

  .chart-placeholder {
    min-height: 160px;
  }

  /* Make the map easier to interact with on phones */
  #realmap {
    aspect-ratio: 16 / 9;
    min-height: 200px;
    height: auto;
  }

  /* Make the panel content scrollable but not too tall */
  .region-panel {
    max-height: 36vh;
    overflow-y: auto;
  }

  /* Semi-donut smaller */
  .semi-donut {
    width: min(88%, 200px);
    height: calc(var(--semi-donut-height, 150px) * 0.7);
  }
  .semi-donut::after {
    width: calc(min(88%, 200px) * 1);
    height: calc(min(88%, 200px) * 1);
    border-width: calc(30px * 0.7);
  }

  .gtext .total { font-size: 16px; }
  .gtext small { font-size: 11px; }
}

/* Extra small devices (very narrow) */
@media (max-width: 360px) {
  .chart-placeholder { min-height: 140px; }
  #realmap { min-height: 180px; }
  .panel-title { font-size: 11px; }
}

/* Make sure the map renders properly when container size changes:
   keeps style-only, no JS modifications. If your JS calls invalidateSize()
   already, this is just defensive. */
@media (max-width: 1100px) {
  #realmap, .map-placeholder {
    width: 100%;
    max-width: 100%;
  }
}

/* Accessibility: increase tap targets slightly on small screens */
@media (max-width: 768px) {
  .map-controls button, .legend-item {
    padding: 8px 6px;
    font-size: 12px;
  }
}