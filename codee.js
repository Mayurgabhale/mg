const fetchEmployeeData = async () => {
  try {
    const res = await fetch("http://localhost:8000/monthly_sheet/employees");
    const data = await res.json();
    
    setEmployeeData(data.employees || []);  // ✅ Fix: use array
    setUploadTime(data.uploaded_at ? new Date(data.uploaded_at) : null);
    setUploadStatus(data.message || "");
  } catch (err) {
    console.error("Failed to fetch employee data:", err);
  }
};j