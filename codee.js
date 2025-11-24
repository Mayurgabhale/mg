GLOBAL Summary
this is headr i want to change this also dark and light theme ok 
write css light and dark theme only for the header ok 
C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\styles.css
GLOBAL Summary
/* === Default (Desktop) === */
#region-title {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background-color: #000000;
  color: #ffdd00;
  /* border-bottom: 3px solid #ffdd00; */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
  font-size: 35px;
  /* border-bottom: 1px solid #000000; */
  /* border-top: 1px solid #000000; */
  font-family: "PP Right Grotesk";
  font-weight: 600;

}

#region-title .region-logo {
  position: absolute;
  left: 50px;
 
  z-index: 1000;

}

C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\script.js


    document.querySelectorAll(".region-button").forEach((button) => {
        button.addEventListener("click", () => {
            const region = button.getAttribute("data-region");
            document.getElementById("region-title").textContent = `${region.toUpperCase()} Summary`;
            switchRegion(region);
        });
    });

    document.getElementById("close-modal").addEventListener("click", () => {
        document.getElementById("modal").style.display = "none";
    });

                const region = currentRegion?.toUpperCase() || "GLOBAL";
                const titleElement = document.getElementById("region-title");

                const logoHTML = `
                    <span class="region-logo">
                        <a href="http://10.199.22.57:3014/" class="tooltip">
                            <i class="fa-solid fa-house"></i>
                            <span class="tooltiptext">Dashboard Hub</span>
                        </a>
                    </span>
                    `;
                if (selectedCity !== "all") {
                    titleElement.innerHTML = `${logoHTML}<span>${region}, ${selectedCity} Summary</span>`;
                } else {
                    titleElement.innerHTML = `${logoHTML}<span>${region} Summary</span>`;

C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\newcss.css
                   
    /* Theme Variables */
    :root {
      /* Dark Theme (Default) */
      --bg-primary: #0f172a;
      --bg-secondary: #1e293b;
      --bg-card: #1a1d29;
      --text-primary: #f1f5f9;
      --text-secondary: #94a3b8;
      --text-accent: #7c3aed;
      --border-color: #334155;
      --shadow: rgba(0, 0, 0, 0.3);
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --chart-bg: #0a0a0a;
    }

    .theme-light {
      /* Light Theme */
      --bg-primary: #f8fafc;
      --bg-secondary: #ffffff;
      --bg-card: #ffffff;
      --text-primary: #1e293b;
      --text-secondary: #64748b;
      --text-accent: #7c3aed;
      --border-color: #e2e8f0;
      --shadow: rgba(0, 0, 0, 0.1);
      --success: #059669;
      --warning: #d97706;
      --danger: #dc2626;
      --chart-bg: #f1f5f9;
    }

    /* Base Styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Poppins', sans-serif;
      background-color: var(--bg-primary);
      color: var(--text-primary);
      transition: all 0.3s ease;
      min-height: 100vh;
    }

    /* Layout */
    .container {
      display: flex;
      min-height: 100vh;
    }

    /* Sidebar Styles */
    .sidebar-toggle {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1001;
      background: var(--text-accent);
      color: white;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px var(--shadow);
      transition: all 0.3s ease;
    }

    .sidebar-toggle:hover {
      transform: scale(1.05);
    }

    #sidebar {
      position: fixed;
      top: 0;
      left: -320px;
      width: 300px;
      height: 100vh;
      background: var(--bg-card);
      color: var(--text-primary);
      padding: 20px;
      overflow-y: auto;
      transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 4px 0 20px var(--shadow);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    #sidebar.active {
      left: 0;
    }

    .sidebar-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      /* background: rgba(0, 0, 0, 0.5); */
      z-index: 999;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s, visibility 0.3s;
    }

    .sidebar-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    /* Main Content */
    #content {
      margin-top: 35px;
      flex: 1;
      padding: 10px 5px;
      transition: margin-left 0.3s ease;
      margin-left: 0;
    }

    #sidebar.active ~ #content {
      margin-left: 300px;
    }

    /* Details Section */
    .details-section {
      background: var(--bg-secondary);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 4px 20px var(--shadow);
      border: 1px solid var(--border-color);
    }

    .details-header {
      display: flex;
      justify-content: between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .details-header h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-accent);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .details-header h2 i {
      font-size: 1.3rem;
    }

    #device-search {
      flex: 1;
      min-width: 250px;
      padding: 12px 16px;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      background: var(--bg-card);
      color: var(--text-primary);
      font-family: 'Poppins', sans-serif;
      font-size: 0.95rem;
      transition: all 0.3s ease;
    }

    #device-search:focus {
      outline: none;
      border-color: var(--text-accent);
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
    }

    #device-search::placeholder {
      color: var(--text-secondary);
    }

    .device-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }




    /* Theme Toggle */
    .theme-toggle {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1001;
      background: var(--text-accent);
      color: white;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px var(--shadow);
      transition: all 0.3s ease;
    }

    .theme-toggle:hover {
      transform: scale(1.05);
    }
