// -----------------------------------------------------------
// MAIN SCRIPT — Clean, Uses only updateMapData_Disabled()
// -----------------------------------------------------------

// Example: your API or data loading
async function loadDashboardData() {
  try {
    // Fetch your backend data (sample)
    const response = await fetch("/api/dashboard");
    const data = await response.json();

    // Extract the summary + device details (your existing structure)
    const summary = data.summary;
    const details = data.deviceDetails;

    // Update your cards, tables, counts (your UI code here)
    updateDashboardCards(summary);
    updateDeviceTables(details);

    // 🔥 Update the map using the NEW separated map module
    updateMapData_Disabled(summary, details);

  } catch (err) {
    console.error("Failed loading dashboard:", err);
  }
}

// -----------------------------------------------------------
// Example UI update functions (you keep your existing ones)
// -----------------------------------------------------------

function updateDashboardCards(summary) {
  if (!summary) return;
  // Your existing counters, charts, etc.
}

function updateDeviceTables(details) {
  if (!details) return;
  // Your table rendering logic
}

// -----------------------------------------------------------
// Start the dashboard when page loads
// -----------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  loadDashboardData();
});