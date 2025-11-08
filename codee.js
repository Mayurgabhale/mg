anythink can be not show after clikc on   <div class="card">
                <h3><i class="fas fa-id-badge icon-3d"></i>Reader</h3>
                <div class="card-status total">Total <span id="reader-total-inline">0</span></div>
                <div class="card-status online">Online <span id="reader-online-inline">0</span></div>
                <div class="card-status offline">Offline <span id="dreader-offline-inline">0</span></div>
            </div>
  this 

<div class="card-status offline">Offline <span id="doorReader-offline">0</span></div>
            </div>
            <div class="card">
                <h3><i class="fas fa-id-badge icon-3d"></i>Reader</h3>
                <div class="card-status total">Total <span id="reader-total-inline">0</span></div>
                <div class="card-status online">Online <span id="reader-online-inline">0</span></div>
                <div class="card-status offline">Offline <span id="dreader-offline-inline">0</span></div>
            </div>
           
            <div class="card">
                <h3><i class="fas fa-server icon-3d"></i>CCURE</h3>
                <div class="card-status total">Total <span id="server-total">0</span></div>
                <div class="card-status online">Online <span id="server-online">0</span></div>
                <div class="card-status offline">Offline <span id="server-offline">0</span></div>
            </div>


        <!-- Main Content -->
        <main id="content">
            
            <section id="details-section" class="details-section">
                <div class="details-header">
                    <h2><i class="fas fa-microchip"></i> Device Details</h2>
                    <input type="text" id="device-search" placeholder="🔍 Search by IP, Location, City..." />
                </div>

                <div id="device-details" class="device-grid">Loading...</div>
                <div id="details-container" class="device-grid"></div>
            </section>

        </main>



// C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\script.js
const baseUrl = "http://localhost:80/api/regions";
let refreshInterval = 300000; // 5 minutes
let pingInterval = 60000; // 30 seconds
let countdownTime = refreshInterval / 1000; // Convert to seconds
let currentRegion = "global";
let deviceDetailsCache = {}; // Store previous details to prevent redundant updates
let latestDetails = null; // Cache the latest fetched details

document.addEventListener("DOMContentLoaded", () => {
    fetchData("global"); // Load initial data
    startAutoRefresh("global");

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


    // ---------------------------
    // NEW: Summary card click/dblclick filter behavior
    // Single click: set device-filter to that type and trigger change (show only that type)
    // Double click: set device-filter to 'all' and trigger change (show all)
    // ---------------------------

    (function attachSummaryCardFilterHandlers() {
        const summaryCards = document.querySelectorAll(".summary .card");
        if (!summaryCards || summaryCards.length === 0) return;

        // helper: derive deviceFilter value from card title text
        function mapCardTitleToFilterValue(title) {
            if (!title) return "all";
            const t = title.toLowerCase();

            if (t.includes("camera")) return "cameras";
            if (t.includes("archiver")) return "archivers";
            if (t.includes("controller")) return "controllers";
            if (t.includes("ccure")) return "servers";       // CCURE servers
            if (t.includes("db")) return "dbdetails";        // DB servers
            if (t.includes("desktop")) return "pcdetails";
            if (t.includes("total")) return "all";

            return "all";
        }

         document.addEventListener("DOMContentLoaded", () => {
                const doorCard = document.getElementById("door-card");
                if (doorCard) {
                    doorCard.style.cursor = "pointer";
                    doorCard.title = "Click to view Controllers";
                    doorCard.addEventListener("click", loadControllersInDetails);
                }
            });



        summaryCards.forEach((card) => {
            // make interactive
            card.style.cursor = "pointer";

            let clickTimer = null;
            const clickDelay = 100; // ms


            card.addEventListener("click", (ev) => {
                if (clickTimer) clearTimeout(clickTimer);
                clickTimer = setTimeout(() => {
                    const h3 = card.querySelector("h3");
                    const titleText = h3 ? h3.innerText.trim() : card.innerText.trim();
                    const filterValue = mapCardTitleToFilterValue(titleText);

                    const deviceFilterElem = document.getElementById("device-filter");
                    if (!deviceFilterElem) return;

                    deviceFilterElem.value = filterValue;
                    deviceFilterElem.dispatchEvent(new Event("change", { bubbles: true }));

                    // 🔥 Highlight clicked card, remove from others
                    document.querySelectorAll(".summary .card").forEach(c => c.classList.remove("active"));
                    if (filterValue !== "all") {
                        card.classList.add("active");
                    }
                }, clickDelay);
            });

            card.addEventListener("dblclick", (ev) => {
                if (clickTimer) {
                    clearTimeout(clickTimer);
                    clickTimer = null;
                }
                const deviceFilterElem = document.getElementById("device-filter");
                if (!deviceFilterElem) return;

                deviceFilterElem.value = "all";
                deviceFilterElem.dispatchEvent(new Event("change", { bubbles: true }));

                // 🔥 Remove all highlights on double-click (reset)
                document.querySelectorAll(".summary .card").forEach(c => c.classList.remove("active"));
            });

           

        });
    })();



});



// 📝📝📝📝📝📝📝📝📝
function loadControllersInDetails() {
  const detailsContainer = document.getElementById("device-details");
  const extraContainer = document.getElementById("details-container");

  detailsContainer.innerHTML = "<p>Loading controllers...</p>";
  extraContainer.innerHTML = "";

  fetch("http://localhost/api/controllers/status")
    .then(res => res.json())
    .then(data => {
      detailsContainer.innerHTML = "";
      if (!Array.isArray(data) || data.length === 0) {
        detailsContainer.innerHTML = "<p>No controllers found.</p>";
        return;
      }

      data.forEach(ctrl => {
        const card = document.createElement("div");
        card.className = "device-card";
        card.style.border = "1px solid #ddd";
        card.style.borderRadius = "10px";
        card.style.padding = "10px";
        card.style.marginBottom = "10px";
        card.style.cursor = "pointer";

        card.innerHTML = `
          <h3 style="font-size:18px; font-weight:600; margin-bottom:8px;">
            ${ctrl.controllername || "Unknown Controller"}
          </h3>
          <p><strong>IP:</strong> ${ctrl.IP_address || "N/A"}</p>
          <p><strong>City:</strong> ${ctrl.City || "Unknown"}</p>
          <p>Status:
            <span style="color:${ctrl.controllerStatus === "Online" ? "green" : "red"};">
              ${ctrl.controllerStatus}
            </span>
          </p>
        `;

        // When a controller is clicked, show its doors + readers
        card.addEventListener("click", () => showDoorsReaders(ctrl));
        detailsContainer.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Error loading controllers:", err);
      detailsContainer.innerHTML = "<p style='color:red;'>Failed to load controllers.</p>";
    });
}





function showDoorsReaders(controller) {
  const extraContainer = document.getElementById("details-container");
  extraContainer.innerHTML = `
    <h3 style="margin-bottom:10px; font-weight:600;">
      ${controller.controllername} — Doors & Readers
    </h3>
  `;

  if (!controller.Doors || controller.Doors.length === 0) {
    extraContainer.innerHTML += "<p>No door data available for this controller.</p>";
    return;
  }

  controller.Doors.forEach(door => {
    const doorCard = document.createElement("div");
    doorCard.className = "device-card";
    doorCard.style.border = "1px solid #aaa";
    doorCard.style.padding = "8px";
    doorCard.style.marginBottom = "8px";
    doorCard.style.borderRadius = "8px";

    doorCard.innerHTML = `
      <p><strong>Door:</strong> ${door.Door}</p>
      <p><strong>Reader:</strong> ${door.Reader || "N/A"}</p>
      <p>Status:
        <span style="color:${door.status === "Online" ? "green" : "red"};">
          ${door.status}
        </span>
      </p>
    `;

    extraContainer.appendChild(doorCard);
  });
}

// 📝📝📝📝📝📝📝📝📝
