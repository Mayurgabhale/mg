// State variables - UPDATED
const [employeeData, setEmployeeData] = useState([]);
const [monthlyFile, setMonthlyFile] = useState(null);
const [showUploadPopup, setShowUploadPopup] = useState(false);
const [hasUploadedData, setHasUploadedData] = useState(false);
const [uploadTime, setUploadTime] = useState(null);
const [uploadStatus, setUploadStatus] = useState("");

// Load data on component mount - UPDATED
useEffect(() => {
  const savedHasUploadedData = localStorage.getItem('hasUploadedData');
  const savedUploadTime = localStorage.getItem('uploadTime');
  const savedMonthlyFile = localStorage.getItem('monthlyFile');
  
  if (savedHasUploadedData === 'true') {
    setHasUploadedData(true);
    if (savedUploadTime) {
      setUploadTime(new Date(savedUploadTime));
    }
    if (savedMonthlyFile) {
      setMonthlyFile(JSON.parse(savedMonthlyFile));
    }
    fetchEmployeeData();
  }
}, []);

// Fetch employee data only when needed
const fetchEmployeeData = async () => {
  try {
    const employeesRes = await fetch("http://localhost:8000/monthly_sheet/employees");
    const employeesData = await employeesRes.json();
    setEmployeeData(employeesData);
  } catch (err) {
    console.error("Failed to fetch employee data:", err);
  }
};

// Handle file selection
const handleMonthlyFileChange = (e) => {
  const selected = e.target.files?.[0];
  setMonthlyFile(selected);
};

// Handle upload submission - UPDATED
const handleUploadSubmit = async () => {
  if (!monthlyFile) return;

  const formData = new FormData();
  formData.append("file", monthlyFile);
  
  try {
    setUploadStatus("Uploading...");
    
    const res = await fetch("http://localhost:8000/monthly_sheet/upload_monthly", {
      method: "POST",
      body: formData,
    });
    
    const result = await res.json();
    
    if (res.ok) {
      setUploadStatus("Upload successful!");
      setUploadTime(new Date());
      setHasUploadedData(true);
      setShowUploadPopup(false);
      
      // Save ALL data to localStorage
      localStorage.setItem('hasUploadedData', 'true');
      localStorage.setItem('uploadTime', new Date().toISOString());
      localStorage.setItem('monthlyFile', JSON.stringify({
        name: monthlyFile.name,
        size: monthlyFile.size,
        type: monthlyFile.type,
        lastModified: monthlyFile.lastModified
      }));
      
      // Fetch the uploaded data
      await fetchEmployeeData();
      toast.success("File uploaded successfully!");
    } else {
      throw new Error(result.detail || "Upload failed");
    }
  } catch (err) {
    console.error(err);
    setUploadStatus("Upload failed!");
    toast.error("Upload failed!");
  }
};

// Delete confirmation
const confirmDeleteData = () => {
  if (window.confirm("Are you sure you want to delete all employee data? This action cannot be undone.")) {
    deleteEmployeeData();
  }
};

// Delete employee data - UPDATED
const deleteEmployeeData = async () => {
  try {
    // Clear backend data
    await fetch("http://localhost:8000/monthly_sheet/clear_data", {
      method: "DELETE"
    });

    // Clear frontend state
    setEmployeeData([]);
    setMonthlyFile(null);
    setHasUploadedData(false);
    setUploadTime(null);
    setUploadStatus("");

    // Clear localStorage
    localStorage.removeItem('hasUploadedData');
    localStorage.removeItem('uploadTime');
    localStorage.removeItem('monthlyFile');

    toast.success("Employee data cleared successfully.");
  } catch (err) {
    console.error(err);
    toast.error("Failed to clear data.");
  }
};