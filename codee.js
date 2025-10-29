import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EmployeeTravelDashboard = () => {
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);

  // 🆕 Load saved data on page reload
  useEffect(() => {
    const loadPreviousData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/data");
        const payload = res.data || {};
        const rows = payload.items || [];
        setItems(rows);
        setSummary(payload.summary || {});
        if (rows.length > 0) {
          toast.info(`Loaded ${rows.length} saved records from previous session.`);
        }
      } catch (err) {
        console.log("No saved data found yet.");
      }
    };
    loadPreviousData();
  }, []);
  
  // ... rest of your existing code (uploadFile, exportCsv, filters, etc.)
};