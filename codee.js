/* Offline Device Graph Card */
.offline-device-card {
    background: var(--graph-card-bg-dark);
    border: 1px solid var(--graph-card-border-dark);
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
    transition: all 0.3s ease;
    border-radius: 8px;
    width: 100%;
    box-sizing: border-box;
    min-height: 280px;
    grid-column: 1 / -1; /* Span full width in grid */
}

.theme-light .offline-device-card {
    background: var(--graph-card-bg-light);
    border: 1px solid var(--graph-card-border-light);
}

.offline-device-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px var(--graph-shadow-dark);
}

.theme-light .offline-device-card:hover {
    box-shadow: 0 8px 25px var(--graph-shadow-light);
}

/* Card title specific for offline device */
.offline-device-card .gcard-title {
    font-size: clamp(14px, 2.5vw, 16px);
    color: var(--graph-card-title-dark);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 15px;
    text-align: center;
}

.theme-light .offline-device-card .gcard-title {
    color: var(--graph-card-title-light);
}

/* Canvas container for offline device chart */
.offline-device-card .chart-container {
    width: 100%;
    height: 100%;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

/* Canvas element styling */
#DotOfflineDevice {
    width: 100% !important;
    height: 100% !important;
    max-height: 240px;
    box-sizing: border-box;
}

/* Responsive Design for Offline Device Card */
/* Tablets and larger phones */
@media (min-width: 768px) {
    .offline-device-card {
        grid-column: 1 / -1;
        min-height: 300px;
    }
    
    #DotOfflineDevice {
        max-height: 260px;
    }
}

/* Desktop and larger tablets */
@media (min-width: 1024px) {
    .offline-device-card {
        min-height: 320px;
    }
    
    #DotOfflineDevice {
        max-height: 280px;
    }
}

/* Mobile devices */
@media (max-width: 767px) {
    .offline-device-card {
        min-height: 250px;
        padding: 12px;
    }
    
    #DotOfflineDevice {
        max-height: 200px;
    }
}

/* Small mobile devices */
@media (max-width: 480px) {
    .offline-device-card {
        min-height: 220px;
        padding: 10px;
    }
    
    .offline-device-card .gcard-title {
        font-size: 13px;
        margin-bottom: 10px;
    }
    
    #DotOfflineDevice {
        max-height: 180px;
    }
}

/* Extra small devices */
@media (max-width: 360px) {
    .offline-device-card {
        min-height: 200px;
    }
    
    #DotOfflineDevice {
        max-height: 160px;
    }
}




<div class="left-grid">
    <div class="gcard">
        <h4 class="gcard-title">Total No. of Cameras</h4>
        <div class="semi-donut gauge" id="gauge-cameras" data-fill="#12b76a"
            style="--percentage:0; --fill:#12b76a">
            <div class="gtext">
                <b class="total">0</b>
                <small><span class="active">0</span> active / <span class="inactive">0</span> inactive</small>
            </div>
        </div>
    </div>

    <div class="gcard">
        <h4 class="gcard-title">Total No. of Archivers</h4>
        <div class="semi-donut gauge" id="gauge-archivers" data-fill="#12b76a"
            style="--percentage:0; --fill:#12b76a">
            <div class="gtext">
                <b class="total">0</b>
                <small><span class="active">0</span> active / <span class="inactive">0</span> inactive</small>
            </div>
        </div>
    </div>

    <div class="gcard">
        <h4 class="gcard-title">Total No. of Controllers</h4>
        <div class="semi-donut gauge" id="gauge-controllers" data-fill="#12b76a"
            style="--percentage:0; --fill:#12b76a">
            <div class="gtext">
                <b class="total">0</b>
                <small><span class="active">0</span> active / <span class="inactive">0</span> inactive</small>
            </div>
        </div>
    </div>

    <div class="gcard">
        <h4 class="gcard-title">TOTAL No. of CCURE</h4>
        <div class="semi-donut gauge" id="gauge-ccure" data-fill="#12b76a"
            style="--percentage:0; --fill:#12b76a">
            <div class="gtext">
                <b class="total">0</b>
                <small><span class="active">0</span> active / <span class="inactive">0</span> inactive</small>
            </div>
        </div>
    </div>

    <!-- Updated Offline Device Card with new class -->
    <div class="offline-device-card">
        <h4 class="gcard-title">Offline Device</h4>
        <div class="chart-container">
            <canvas id="DotOfflineDevice"></canvas>
        </div>
    </div>
</div>