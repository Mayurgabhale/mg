refreshFailureChart({
  cameras: 15,
  controllers: 8,
  archivers: 20,
  servers: 5,
  desktops: 10,
  dbServers: 3
});




failureChart.data.datasets[0].data = [
  { x: 2, y: 15 },
  { x: 6, y: 8 },
  { x: 10, y: 20 },
  { x: 14, y: 5 },
  { x: 18, y: 10 },
  { x: 22, y: 3 }
];
failureChart.update();