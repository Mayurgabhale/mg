import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [analytics, setAnalytics] = useState({
    totalTravelers: 0,
    active: 0,
    inactive: 0,
  });
  const [items, setItems] = useState([]);

  // 📦 Upload file handler
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:8000/upload", formData);
      // 🧠 After upload success — fetch latest stats
      fetchData();
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  // 🔄 Fetch previous or current data
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/data");
      const data = res.data;
      setItems(data.items || []);
      setAnalytics(data.summary || {});
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // ⏱ Auto refresh every few seconds
  useEffect(() => {
    fetchData(); // Load existing data on mount

    const interval = setInterval(() => {
      fetchData();
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* File upload */}
      <input
        type="file"
        onChange={(e) => handleUpload(e.target.files[0])}
      />

      {/* Quick Stats */}
      <div>
        <h3>Quick Stats</h3>
        <p>Total Travelers: {analytics.totalTravelers}</p>
        <p>Active Now: {analytics.active}</p>
        <p>Inactive: {analytics.inactive}</p>
      </div>

      {/* ... your existing table and analytics components */}
    </div>
  );
}

export default Dashboard;