.theme-light {
    /* Light Theme Colors - Fixed for Graph Visibility */
    --graph-bg-light: #ffffff;
    --graph-text-light: #1e293b;
    --graph-title-light: #059669;
    --graph-card-bg-light: linear-gradient(180deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.01));
    --graph-card-border-light: rgba(0, 0, 0, 0.15);
    --graph-card-title-light: #1f2937;
    --graph-card-footer-light: #6b7280;
    --graph-map-bg-light: #ffffff;
    --graph-map-text-light: #059669;
    --graph-map-annot-bg-light: rgba(0, 0, 0, 0.05);
    --graph-map-annot-border-light: rgba(0, 0, 0, 0.1);
    --graph-gauge-active: #10b981;
    --graph-gauge-inactive: #d97706;
    --graph-gauge-total: #059669;
    --graph-gauge-text: #d97706;
    --graph-shadow-light: rgba(0, 0, 0, 0.1);

    /* Chart Colors for Light Theme - Enhanced Contrast */
    --chart-camera-color: #dc2626;
    --chart-archiver-color: #2563eb;
    --chart-controller-color: #d97706;
    --chart-ccure-color: #7c3aed;
    --chart-grid-color: #d1d5db; /* Light gray for grid lines */
    --chart-text-color: #374151; /* Dark gray for text */
    --chart-bg-color: #ffffff;
    --chart-axis-color: #4b5563; /* Specific color for axis */
}

/* Fix for Offline Device Card in Light Theme */
.theme-light .offline-device-card {
    background: var(--graph-card-bg-light);
    border: 1px solid var(--graph-card-border-light);
}

.theme-light .offline-device-card .gcard-title {
    color: var(--graph-card-title-light);
}

/* Ensure chart background is properly set */
.theme-light #DotOfflineDevice {
    background: var(--chart-bg-color) !important;
}