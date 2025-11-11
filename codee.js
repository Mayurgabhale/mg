// State variables
const [employeeData, setEmployeeData] = useState([]);
const [monthlyFile, setMonthlyFile] = useState(null);
const [uploadStatus, setUploadStatus] = useState("");
const [uploadTime, setUploadTime] = useState(null);
const [showUploadPopup, setShowUploadPopup] = useState(false);
const [hasUploadedData, setHasUploadedData] = useState(false);

// Load data on component mount
useEffect(() => {
  const savedUploadStatus = localStorage.getItem('uploadStatus');
  const savedUploadTime = localStorage.getItem('uploadTime');
  const savedMonthlyFile = localStorage.getItem('monthlyFile');
  const savedHasUploadedData = localStorage.getItem('hasUploadedData');

  if (savedUploadStatus) setUploadStatus(savedUploadStatus);
  if (savedUploadTime) setUploadTime(new Date(savedUploadTime));
  if (savedMonthlyFile) setMonthlyFile(JSON.parse(savedMonthlyFile));
  if (savedHasUploadedData === 'true') {
    setHasUploadedData(true);
    fetchEmployeeData();
  }
}, []);

// Fetch employee data
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

// Handle upload submission
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
      
      // Save to localStorage
      localStorage.setItem('uploadStatus', "Upload successful!");
      localStorage.setItem('uploadTime', new Date().toISOString());
      localStorage.setItem('monthlyFile', JSON.stringify({
        name: monthlyFile.name,
        size: monthlyFile.size,
        type: monthlyFile.type,
        lastModified: monthlyFile.lastModified
      }));
      localStorage.setItem('hasUploadedData', 'true');
      
      // Fetch the uploaded data
      await fetchEmployeeData();
      toast.success("File uploaded successfully!");
    } else {
      throw new Error(result.detail || "Upload failed");
    }
  } catch (err) {
    console.error(err);
    setUploadStatus("Upload failed: " + err.message);
    toast.error("Upload failed!");
  }
};

// Delete confirmation
const confirmDeleteData = () => {
  if (window.confirm("Are you sure you want to delete all employee data? This action cannot be undone.")) {
    deleteEmployeeData();
  }
};

// Delete employee data
const deleteEmployeeData = async () => {
  try {
    // Clear backend data
    await fetch("http://localhost:8000/monthly_sheet/clear_data", {
      method: "DELETE"
    });

    // Clear frontend state
    setEmployeeData([]);
    setUploadStatus("");
    setUploadTime(null);
    setMonthlyFile(null);
    setHasUploadedData(false);

    // Clear localStorage
    localStorage.removeItem('uploadStatus');
    localStorage.removeItem('uploadTime');
    localStorage.removeItem('monthlyFile');
    localStorage.removeItem('hasUploadedData');

    toast.success("Employee data cleared successfully.");
  } catch (err) {
    console.error(err);
    toast.error("Failed to clear data.");
  }
};