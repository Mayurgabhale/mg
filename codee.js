/* Remove gap between right panel and LOC Count chart */
.right-panel {
    margin-bottom: 0 !important;
    padding-bottom: 0 !important;
}

.worldmap-card {
    margin-bottom: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
}

/* LOC Count chart - remove top gap and connect directly to map */
#Loc-Count-chart {
    margin-top: 0 !important;
    padding-top: 0 !important;
    border-top: none !important;
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
}

/* Remove bottom gap from worldmap-card and connect directly to LOC chart */
.worldmap-card .map-bottom-bar {
    border-bottom: none !important;
}

/* Ensure smooth transition between map and chart */
.worldmap-card {
    box-shadow: 0 6px 20px var(--shadow) !important;
}

#Loc-Count-chart {
    box-shadow: 0 6px 20px var(--shadow) !important;
    border-top: 1px solid var(--border-color) !important;
}

/* Adjust the bottom-row to remove any gaps */
.bottom-row {
    margin-top: 0 !important;
    padding-top: 0 !important;
    gap: 0 !important;
}

/* Specific styling for LOC Count chart when placed below map */
#Loc-Count-chart.gcard {
    border-top: 1px solid var(--border-color) !important;
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
}

/* Remove any padding/margin from the canvas container */
#Loc-Count-chart .gcard-title {
    margin-bottom: 10px !important;
    padding-top: 15px !important;
}

#cityBarChart {
    width: 100% !important;
    height: calc(100% - 50px) !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .right-panel {
        margin-bottom: 0 !important;
    }
    
    #Loc-Count-chart {
        margin-top: 0 !important;
    }
    
    #Loc-Count-chart .gcard-title {
        padding-top: 12px !important;
        margin-bottom: 8px !important;
    }
}

@media (max-width: 480px) {
    #Loc-Count-chart .gcard-title {
        padding-top: 10px !important;
        margin-bottom: 6px !important;
    }
}