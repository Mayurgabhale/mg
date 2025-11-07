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
                    <div class="card-status offline">Offline <span id="offline-devices">0</span></div>
                </div>

                <div class="card">
                    <h3><i class="fas fa-video"></i> Cameras</h3>
                    <div class="card-status total">Total <span id="camera-total">0</span></div>
                    <div class="card-status online">Online <span id="camera-online">0</span></div>
                    <div class="card-status offline">Offline <span id="camera-offline">0</span></div>
                </div>

                <div class="card">
                    <h3><i class="fas fa-database"></i> Archivers</h3>
                    <div class="card-status total">Total <span id="archiver-total">0</span></div>
                    <div class="card-status online">Online <span id="archiver-online">0</span></div>
                    <div class="card-status offline">Offline <span id="archiver-offline">0</span></div>
                </div>

                <div class="card">
                    <h3><i class="fas fa-id-card"></i> Controllers</h3>
                    <div class="card-status total">Total <span id="controller-total">0</span></div>
                    <div class="card-status online">Online <span id="controller-online">0</span></div>
                    <div class="card-status offline">Offline <span id="controller-offline">0</span></div>
                </div>

                <div class="card">
                    <h3><i class="fas fa-server"></i> CCURE</h3>
                    <div class="card-status total">Total <span id="server-total">0</span></div>
                    <div class="card-status online">Online <span id="server-online">0</span></div>
                    <div class="card-status offline">Offline <span id="server-offline">0</span></div>
                </div>

                <div class="card">
                    <h3><i class="fas fa-desktop"></i> Desktop</h3>
                    <div class="card-status total">Total <span id="pc-total">0</span></div>
                    <div class="card-status online">Online <span id="pc-online">0</span></div>
                    <div class="card-status offline">Offline <span id="pc-offline">0</span></div>
                </div>

                <div class="card">
                    <h3><i class="fas fa-database"></i> DB Server</h3>
                    <div class="card-status total">Total <span id="db-total">0</span></div>
                    <div class="card-status online">Online <span id="db-online">0</span></div>
                    <div class="card-status offline">Offline <span id="db-offline">0</span></div>
                </div>
            </div>

            <!-- Device Details -->
            <section id="details-section" class="details-section">
                <div class="details-header">
                    <h2><i class="fas fa-microchip"></i> Device Details</h2>
                    <input type="text" id="device-search" placeholder="🔍 Search by IP, Location, City..." />
                </div>

                <div id="device-details" class="device-grid">
                    <!-- Sample device cards for demonstration -->
                    <div class="device-card" data-status="online" data-type="cameras">
                        <h3 class="device-name">Front Entrance Camera</h3>
                        <div class="device-type-label cameras">
                            <strong><i class="fas fa-video"></i> Camera</strong>
                            <button class="open-camera-btn">
                                <i class="fas fa-external-link-alt"></i> View
                            </button>
                        </div>
                        <p><strong><i class="fas fa-network-wired"></i> IP:</strong>
                            <span class="device-ip" title="Click to copy">192.168.1.100</span>
                        </p>
                        <p><strong><i class="fas fa-map-marker-alt"></i> Location:</strong> Main Entrance</p>
                        <p><strong><i class="fas fa-city"></i> City:</strong> New York</p>
                    </div>

                    <div class="device-card" data-status="offline" data-type="servers">
                        <h3 class="device-name">CCURE Server 01</h3>
                        <div class="device-type-label servers">
                            <strong><i class="fas fa-server"></i> CCURE Server</strong>
                        </div>
                        <p><strong><i class="fas fa-network-wired"></i> IP:</strong>
                            <span class="device-ip" title="Click to copy">192.168.1.50</span>
                        </p>
                        <p><strong><i class="fas fa-map-marker-alt"></i> Location:</strong> Server Room B</p>
                        <p><strong><i class="fas fa-city"></i> City:</strong> London</p>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <!-- Modal -->
    <div id="modal">
        <div class="modal-content">
            <span id="close-modal">&times;</span>
            <h3 id="modal-title">Device Details</h3>
            <ul id="modal-body"></ul>
        </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
        <p>
            <img src="images/new-header.png" alt="Company Logo" class="footer-logo" />
        </p>
        <p>&copy; 2025 VisionWatch | Powered by <strong>Western Union Services India Pvt Ltd.</strong></p>
        <p>Contact:
            <a href="mailto:gsoc-globalsecurityoperationcenter.sharedmailbox@westernunion.com">Email</a> |
            <a href="tel:+912067632394">+91 20 67632394</a>
        </p>
    </footer>

    <script>
        // Theme Toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('theme-light');
            const icon = themeToggle.querySelector('i');
            if (document.body.classList.contains('theme-light')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });

        // Scroll to Top Button
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.display = 'block';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Region buttons
        const regionButtons = document.querySelectorAll('.region-button');
        regionButtons.forEach(button => {
            button.addEventListener('click', () => {
                regionButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                // Here you would update the dashboard based on the selected region
            });
        });

        // Status filters
        const statusFilters = document.querySelectorAll('.status-filter');
        statusFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                statusFilters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
                // Here you would filter devices based on status
            });
        });

        // Device search
        const deviceSearch = document.getElementById('device-search');
        deviceSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const deviceCards = document.querySelectorAll('.device-card');
            
            deviceCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });

        // Copy IP to clipboard
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                alert(`IP address ${text} copied to clipboard`);
            });
        }

        // Add event listeners to IP addresses
        document.querySelectorAll('.device-ip').forEach(ip => {
            ip.addEventListener('click', (e) => {
                copyToClipboard(e.target.textContent);
            });
        });

        // Countdown timer (example)
        let timeLeft = 30;
        const timerElement = document.getElementById('timer');
        
        const countdown = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `${timeLeft}s`;
            
            if (timeLeft <= 0) {
                timeLeft = 30;
                // Here you would refresh the data
            }
        }, 1000);

        // Modal functionality
        const modal = document.getElementById('modal');
        const closeModal = document.getElementById('close-modal');
        
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Sample data for demonstration
        document.getElementById('total-devices').textContent = '142';
        document.getElementById('online-devices').textContent = '128';
        document.getElementById('offline-devices').textContent = '14';
        
        document.getElementById('camera-total').textContent = '65';
        document.getElementById('camera-online').textContent = '60';
        document.getElementById('camera-offline').textContent = '5';
        
        document.getElementById('archiver-total').textContent = '12';
        document.getElementById('archiver-online').textContent = '11';
        document.getElementById('archiver-offline').textContent = '1';
        
        document.getElementById('controller-total').textContent = '25';
        document.getElementById('controller-online').textContent = '23';
        document.getElementById('controller-offline').textContent = '2';
        
        document.getElementById('server-total').textContent = '8';
        document.getElementById('server-online').textContent = '7';
        document.getElementById('server-offline').textContent = '1';
        
        document.getElementById('pc-total').textContent = '20';
        document.getElementById('pc-online').textContent = '18';
        document.getElementById('pc-offline').textContent = '2';
        
        document.getElementById('db-total').textContent = '12';
        document.getElementById('db-online').textContent = '9';
        document.getElementById('db-offline').textContent = '3';
    </script>
</body>
</html>