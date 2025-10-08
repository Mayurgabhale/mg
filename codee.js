// Page setup for printing
ws.pageSetup = {
  orientation: 'landscape',
  fitToPage: true,
  fitToWidth: 1,
  fitToHeight: 0,  // unlimited height, but fit width to 1 page
  horizontalCentered: true,
  verticalCentered: false, // keep top aligned
  margins: {
    left: 0.5, right: 0.5,
    top: 0.75, bottom: 0.75,
    header: 0.3, footer: 0.3
  }
};