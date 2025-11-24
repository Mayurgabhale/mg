<!DOCTYPE html>
<html>
<head>
    <title>Device Dashboard</title>

    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <!-- Our chart logic -->
    <script src="graph.js"></script>

    <!-- Main app logic -->
    <script src="script.js" defer></script>

    <style>
        canvas {
            width: 100% !important;
            height: 240px !important;
        }
    </style>
</head>
<body>

<h2>Offline Devices Scatter Chart</h2>
<canvas id="DotOfflineDevice"></canvas>

<h2>Devices List</h2>
<div id="devicesContainer"></div>

</body>
</html>