// --- state (adjusted newTraveler keys) ---
const [showAddForm, setShowAddForm] = useState(false);
const [newTraveler, setNewTraveler] = useState({
  first_name: "",
  last_name: "",
  emp_id: "",
  email: "",
  begin_date: "",   // changed from begin_dt -> begin_date
  end_date: "",     // changed from end_dt   -> end_date
  from_location: "",
  from_country: "",
  to_location: "",
  to_country: "",
  leg_type: "",
});

// --- addTraveler: use correct daily_sheet endpoint and payload keys ---
const addTraveler = async () => {
  try {
    // Ensure payload field names match backend (begin_date / end_date)
    const payload = {
      ...newTraveler,
      // optional: you can map/normalize here if your UI uses different names
      // begin_date: newTraveler.begin_date,
      // end_date: newTraveler.end_date,
    };

    await axios.post("http://localhost:8000/daily_sheet/add_traveler", payload);
    toast.success("Traveler added successfully!");
    setShowAddForm(false);
    setNewTraveler({
      first_name: "",
      last_name: "",
      emp_id: "",
      email: "",
      begin_date: "",
      end_date: "",
      from_location: "",
      from_country: "",
      to_location: "",
      to_country: "",
      leg_type: "",
    });

    // Refresh data after adding (use the daily_sheet data endpoint)
    const res = await axios.get("http://localhost:8000/daily_sheet/data");
    const respPayload = res.data || {};
    setItems(respPayload.items || []);
    setSummary(respPayload.summary || {});
    if (respPayload.last_updated) setLastUpdated(respPayload.last_updated);
  } catch (err) {
    console.error(err);
    toast.error("Failed to add traveler. Check backend.");
  }
};

// --- useEffect: fetchLatest should hit /daily_sheet/data ---
useEffect(() => {
  const fetchLatest = async (showToast = false) => {
    try {
      const res = await axios.get("http://localhost:8000/daily_sheet/data");
      const payload = res.data || {};
      const rows = payload.items || [];

      if (rows.length > 0) {
        setItems(rows);
        setSummary(payload.summary || {});
        if (showToast) {
          toast.info(`Loaded ${rows.length} saved records from previous session.`);
        }
        if (payload.last_updated) setLastUpdated(payload.last_updated);
      }
    } catch (err) {
      console.warn("No saved data yet — upload a file to start.");
    }
  };

  // initial load
  fetchLatest(true);

  // keep refreshing every 10s
  const interval = setInterval(() => fetchLatest(false), 10000);
  return () => clearInterval(interval);
}, []);

// --- uploadFile: point to /daily_sheet/upload (same multipart form) ---
const handleFileChange = (e) => setFile(e.target.files[0]);

const uploadFile = async () => {
  if (!file) return toast.warn("Please select an Excel or CSV file first.");
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append("file", file);
    // NOTE: endpoint changed to /daily_sheet/upload
    const res = await axios.post("http://localhost:8000/daily_sheet/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const payload = res.data || {};
    const rows = payload.items || [];
    setItems(rows);
    setSummary(payload.summary || {});
    if (payload.last_updated) setLastUpdated(payload.last_updated);
    toast.success(`Uploaded successfully. ${rows.length} records found.`);
  } catch (err) {
    console.error(err);
    toast.error("Upload failed. Please check the backend or file format.");
  } finally {
    setLoading(false);
  }
};

// --- Regions / record fetch: backend exposes records endpoints; example fetchRecord ---
// The original code requested a /regions endpoint which doesn't exist in your daily_sheet router.
// Use /daily_sheet/records to list records or /daily_sheet/records/{id} to get a specific record.
const fetchDailyRecords = async () => {
  try {
    const res = await axios.get("http://localhost:8000/daily_sheet/records");
    // expected: res.data could be an array or an object depending on your backend implementation
    // adapt handling below to match your backend's response shape
    const records = res.data || [];
    // you can store them in state if needed: setDailyRecords(records);
    return records;
  } catch (err) {
    console.error("Error fetching daily records:", err);
    toast.error("Failed to fetch daily records");
    return [];
  }
};

const fetchRecordDetails = async (recordId) => {
  try {
    const res = await axios.get(`http://localhost:8000/daily_sheet/records/${recordId}`);
    const record = res.data || null;
    // set state or return record
    // setRegionDetails(record)  // only if you have state for it
    return record;
  } catch (err) {
    console.error("Error fetching record details:", err);
    toast.error("Failed to load record details");
    return null;
  }
};