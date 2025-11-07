<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Device Dashboard</title>
    <link rel="icon" href="images/favicon.png" sizes="32x32" type="images/png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            /* Modern Color Palette */
            --primary: #3a86ff;
            --primary-dark: #2667cc;
            --secondary: #8338ec;
            --accent: #ff006e;
            --success: #38b000;
            --warning: #ff9e00;
            --danger: #ef476f;
            --dark: #1a1d29;
            --dark-light: #252a3a;
            --light: #f8f9fa;
            --gray: #6c757d;
            --gray-light: #e9ecef;
            
            /* Theme Variables */
            --bg-primary: #0f1419;
            --bg-secondary: #1a202c;
            --bg-card: #252a3a;
            --text-primary: #f8f9fa;
            --text-secondary: #adb5bd;
            --border-color: #2d3748;
            --shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            --transition: all 0.3s ease;
        }

        .theme-light {
            --bg-primary: #f8f9fa;
            --bg-secondary: #ffffff;
            --bg-card: #ffffff;
            --text-primary: #212529;
            --text-secondary: #6c757d;
            --border-color: #dee2e6;
            --shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background-color: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.6;
            transition: var(--transition);
        }

        .container {
            display: flex;
            min-height: 100vh;
        }

        /* Header Styles */
        .dashboard-header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: linear-gradient(135deg, var(--dark), var(--primary-dark));
            color: white;
            padding: 0 20px;
            height: 70px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            z-index: 1000;
            box-shadow: var(--shadow);
            border-bottom: 1px solid var(--border-color);
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .header-title {
            font-size: 1.5rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .header-title i {
            color: var(--accent);
        }

        .header-controls {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .theme-toggle {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            transition: var(--transition);
        }

        .theme-toggle:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }

        /* Sidebar Styles */
        #sidebar {
            width: 280px;
            background: var(--bg-secondary);
            padding: 30px 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
            transition: var(--transition);
            border-right: 1px solid var(--border-color);
            overflow-y: auto;
            height: calc(100vh - 70px);
            position: fixed;
            top: 70px;
        }

        .region-button, .nav-button, .status-filter {
            background: var(--bg-card);
            color: var(--text-primary);
            border: 1px solid var(--border-color);
            padding: 12px 16px;
            border-radius: 8px;
            cursor: pointer;
            transition: var(--transition);
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            gap: 12px;
            text-align: left;
            font-weight: 500;
        }

        .region-button:hover, .nav-button:hover, .status-filter:hover {
            background: var(--primary);
            color: white;
            transform: translateY(-2px);
            box-shadow: var(--shadow);
        }

        .status-filter.active {
            background: var(--primary);
            color: white;
        }

        .filter-buttons {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin: 10px 0;
        }

        #sidebar label {
            font-size: 0.9rem;
            color: var(--text-secondary);
            margin-top: 15px;
            margin-bottom: 5px;
            display: block;
        }

        #sidebar select {
            background: var(--bg-card);
            color: var(--text-primary);
            border: 1px solid var(--border-color);
            padding: 10px;
            border-radius: 6px;
            width: 100%;
            font-size: 0.9rem;
        }

        .countdown-timer {
            background: var(--bg-card);
            padding: 12px;
            border-radius: 8px;
            text-align: center;
            font-weight: 500;
            color: var(--text-secondary);
            margin: 10px 0;
            border: 1px solid var(--border-color);
        }

        /* Main Content */
        #content {
            flex: 1;
            padding: 30px;
            margin-left: 280px;
            margin-top: 70px;
            transition: var(--transition);
        }

        /* Summary Cards */
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .card {
            background: var(--bg-card);
            border-radius: 12px;
            padding: 20px;
            box-shadow: var(--shadow);
            transition: var(--transition);
            border: 1px solid var(--border-color);
            position: relative;
            overflow: hidden;
        }

        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
        }

        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .card h3 {
            font-size: 1.1rem;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--text-primary);
        }

        .card h3 i {
            font-size: 1.3rem;
            color: var(--primary);
        }

        .card-status {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            margin-bottom: 8px;
            border-radius: 6px;
            font-size: 0.9rem;
            font-weight: 500;
        }

        .card-status.total {
            background: rgba(58, 134, 255, 0.1);
            color: var(--primary);
        }

        .card-status.online {
            background: rgba(56, 176, 0, 0.1);
            color: var(--success);
        }

        .card-status.offline {
            background: rgba(239, 71, 111, 0.1);
            color: var(--danger);
        }

        /* Device Details Section */
        .details-section {
            margin-top: 30px;
        }

        .details-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 15px;
        }

        .details-header h2 {
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--text-primary);
        }

        .details-header h2 i {
            color: var(--primary);
        }

        #device-search {
            padding: 10px 15px;
            border-radius: 8px;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            width: 300px;
            font-size: 0.9rem;
            transition: var(--transition);
        }

        #device-search:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 2px rgba(58, 134, 255, 0.2);
        }

        .device-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 20px;
        }

        .device-card {
            background: var(--bg-card);
            border-radius: 12px;
            padding: 20px;
            box-shadow: var(--shadow);
            transition: var(--transition);
            border: 1px solid var(--border-color);
            position: relative;
        }

        .device-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .device-card[data-status="online"] {
            border-left: 4px solid var(--success);
        }

        .device-card[data-status="offline"] {
            border-left: 4px solid var(--danger);
        }

        .device-name {
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 12px;
            color: var(--text-primary);
        }

        .device-type-label {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            font-weight: 500;
        }

        .device-type-label i {
            margin-right: 8px;
        }

        .open-camera-btn {
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 6px;
            padding: 6px 10px;
            cursor: pointer;
            font-size: 0.8rem;
            transition: var(--transition);
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .open-camera-btn:hover {
            background: var(--primary-dark);
        }

        .device-card p {
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-secondary);
            font-size: 0.9rem;
        }

        .device-card p strong {
            color: var(--text-primary);
            min-width: 80px;
        }

        .device-ip {
            color: var(--primary);
            cursor: pointer;
            transition: var(--transition);
        }

        .device-ip:hover {
            color: var(--primary-dark);
            text-decoration: underline;
        }

        /* Scroll to Top Button */
        #scrollToTopBtn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 100;
            background: var(--primary);
            color: white;
            box-shadow: var(--shadow);
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 1.2rem;
            cursor: pointer;
            display: none;
            transition: var(--transition);
        }

        #scrollToTopBtn:hover {
            background: var(--primary-dark);
            transform: scale(1.1);
        }

        /* Footer */
        .footer {
            background: var(--dark);
            color: white;
            padding: 20px;
            text-align: center;
            border-top: 1px solid var(--border-color);
        }

        .footer-logo {
            height: 30px;
            margin-bottom: 10px;
        }

        .footer p {
            margin-bottom: 5px;
        }

        .footer a {
            color: var(--primary);
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }

        /* Modal */
        #modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 2000;
            justify-content: center;
            align-items: center;
        }

        .modal-content {
            background: var(--bg-card);
            border-radius: 12px;
            padding: 30px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            position: relative;
        }

        #close-modal {
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-secondary);
            transition: var(--transition);
        }

        #close-modal:hover {
            color: var(--danger);
        }

        #modal-title {
            font-size: 1.3rem;
            margin-bottom: 15px;
            color: var(--text-primary);
        }

        #modal-body {
            list-style: none;
        }

        #modal-body li {
            padding: 8px 0;
            border-bottom: 1px solid var(--border-color);
            color: var(--text-secondary);
        }

        #modal-body li:last-child {
            border-bottom: none;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
            #sidebar {
                width: 250px;
            }
            #content {
                margin-left: 250px;
            }
        }

        @media (max-width: 768px) {
            .container {
                flex-direction: column;
            }
            #sidebar {
                width: 100%;
                height: auto;
                position: static;
                padding: 20px;
            }
            #content {
                margin-left: 0;
                padding: 20px;
            }
            .details-header {
                flex-direction: column;
                align-items: flex-start;
            }
            #device-search {
                width: 100%;
            }
            .device-grid {
                grid-template-columns: 1fr;
            }
            .summary {
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            }
        }

        @media (max-width: 480px) {
            .dashboard-header {
                padding: 0 15px;
            }
            .header-title {
                font-size: 1.2rem;
            }
            .summary {
                grid-template-columns: 1fr;
            }
            .card-status {
                flex-direction: column;
                align-items: flex-start;
                gap: 5px;
            }
        }

        /* Animation for cards */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .card, .device-card {
            animation: fadeIn 0.5s ease forwards;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--bg-secondary);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--primary);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--primary-dark);
        }
    </style>
</head>

<body>
    <button id="scrollToTopBtn" title="Go to top">
        <i class="bi bi-chevron-double-up"></i>
    </button>

    <div class="dashboard-header">
        <div class="header-left">
            <div class="header-title">
                <i class="fas fa-tachometer-alt"></i>
                Device Dashboard
            </div>
        </div>
        <div class="header-controls">
            <button class="theme-toggle" id="themeToggle">
                <i class="fas fa-moon"></i>
            </button>
        </div>
    </div>

    <div class="container">
        <!-- Sidebar -->
        <aside id="sidebar">
            <button class="region-button active" data-region="global">
                <i class="fas fa-globe"></i> Global Overview
            </button>
            <button class="region-button" data-region="apac">
                <i class="fas fa-map-marker-alt"></i> APAC Region
            </button>
            <button class="region-button" data-region="emea">
                <i class="fas fa-map-marker-alt"></i> EMEA Region
            </button>
            <button class="region-button" data-region="laca">
                <i class="fas fa-map-marker-alt"></i> LACA Region
            </button>
            <button class="region-button" data-region="namer">
                <i class="fas fa-map-marker-alt"></i> NAMER Region
            </button>

            <button class="nav-button" onclick="location.href='trend.html'">
                <i class="fas fa-chart-line"></i> View Trend Analysis
            </button>
            <button class="nav-button" onclick="location.href='summary.html'">
                <i class="fas fa-table"></i> View Devices Summary
            </button>

            <div id="countdown" class="countdown-timer">
                <i class="fas fa-sync-alt"></i> Next update in: <span id="timer">30s</span>
            </div>

            <div class="filter-buttons">
                <button id="filter-all" class="status-filter active" data-status="all">
                    <i class="fas fa-layer-group"></i> All Devices
                </button>
                <button id="filter-online" class="status-filter" data-status="online">
                    <i class="fas fa-wifi"></i> Online Devices
                </button>
                <button id="filter-offline" class="status-filter" data-status="offline">
                    <i class="fas fa-plug-circle-xmark"></i> Offline Devices
                </button>
            </div>

            <label for="device-filter">Filter by Device Type:</label>
            <select id="device-filter">
                <option value="all">All Devices</option>
                <option value="cameras">Cameras</option>
                <option value="archivers">Archivers</option>
                <option value="controllers">Controllers</option>
                <option value="servers">CCURE</option>
                <option value="pcdetails">Desktop Details</option>
                <option value="dbdetails">DB Server</option>
            </select>

            <label for="vendorFilter" id="vendorFilterLabel">Filter by Camera:</label>
            <select id="vendorFilter">
                <option value="all">All Cameras</option>
            </select>

            <label for="city-filter">Filter by Location:</label>
            <select id="city-filter">
                <option value="all">All Cities</option>
            </select>
        </aside>

        <!-- Main Content -->
        <main id="content">
            <div class="summary">
                <div class="card">
                    <h3><i class="fas fa-microchip"></i> Total Devices</h3>
                    <div class="card-status total">Total <span id="total-devices">0</span></div>
                    <div class="card-status online">Online <span id="online-devices">0</span></div>
    