// ⬇️⬇️ this is call from graph.js
    initOfflineChart();
    // ensure bar chart is also created (safe to call even if already initialized)
    if (typeof initOfflineCityBarChart === "function") {
      try { initOfflineCityBarChart(); } catch(e){ console.warn("initOfflineCityBarChart failed:", e); }
    }

    fetchData("global"); // Load initial data
    startAutoRefresh("global");