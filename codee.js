const [employeeData, setEmployeeData] = useState([]);
const [monthlyFile, setMonthlyFile] = useState(null);
const [uploadStatus, setUploadStatus] = useState("");
const [uploadTime, setUploadTime] = useState(null);
const [showUploadCard, setShowUploadCard] = useState(true);
const [hasUploadedData, setHasUploadedData] = useState(false); // Track if data exists

// Load metadata from localStorage on component mount
useEffect(() => {
    const savedUploadStatus = localStorage.getItem('uploadStatus');
    const savedUploadTime = localStorage.getItem('uploadTime');
    const savedMonthlyFile = localStorage.getItem('monthlyFile');
    const savedHasUploadedData = localStorage.getItem('hasUploadedData');

    if (savedUploadStatus) {
        setUploadStatus(savedUploadStatus);
    }
    if (savedUploadTime) {
        setUploadTime(new Date(savedUploadTime));
    }
    if (savedMonthlyFile) {
        setMonthlyFile(JSON.parse(savedMonthlyFile));
    }
    if (savedHasUploadedData === 'true') {
        setHasUploadedData(true);
        setShowUploadCard(false);
        
        // Fetch employee data from backend if we have uploaded data
        fetchEmployeeData();
    }
}, []);

// Fetch employee data from backend
const fetchEmployeeData = async () => {
    try {
        const employeesRes = await fetch("http://localhost:8000/monthly_sheet/employees");
        const employeesData = await employeesRes.json();
        setEmployeeData(employeesData);
    } catch (err) {
        console.error("Failed to fetch employee data:", err);
    }
};

// Save only metadata to localStorage
useEffect(() => {
    if (uploadStatus) {
        localStorage.setItem('uploadStatus', uploadStatus);
    }
}, [uploadStatus]);

useEffect(() => {
    if (uploadTime) {
        localStorage.setItem('uploadTime', uploadTime.toISOString());
    }
}, [uploadTime]);

useEffect(() => {
    if (monthlyFile) {
        localStorage.setItem('monthlyFile', JSON.stringify({
            name: monthlyFile.name,
            size: monthlyFile.size,
            type: monthlyFile.type,
            lastModified: monthlyFile.lastModified
        }));
    }
}, [monthlyFile]);

useEffect(() => {
    localStorage.setItem('hasUploadedData', hasUploadedData.toString());
}, [hasUploadedData]);

const handleMonthlyFileChange = (e) => {
    const selected = e.target.files?.[0];
    console.log("Selected:", selected);
    setMonthlyFile(selected);
};

const uploadMonthlySheet = async () => {
    if (!monthlyFile) return alert("Please select a file first.");

    const formData = new FormData();
    formData.append("file", monthlyFile);

    try {
        setUploadStatus("Uploading...");
        const res = await fetch("http://localhost:8000/monthly_sheet/upload_monthly", {
            method: "POST",
            body: formData,
        });
        const result = await res.json();
        setUploadStatus(result.message || "Upload success!");
        setUploadTime(new Date());

        // Hide upload card after successful upload
        setShowUploadCard(false);
        setHasUploadedData(true);

        // Fetch employee data after successful upload
        await fetchEmployeeData();

        // Save metadata to localStorage
        localStorage.setItem('uploadStatus', result.message || "Upload success!");
        localStorage.setItem('uploadTime', new Date().toISOString());
        localStorage.setItem('monthlyFile', JSON.stringify({
            name: monthlyFile.name,
            size: monthlyFile.size,
            type: monthlyFile.type,
            lastModified: monthlyFile.lastModified
        }));
        localStorage.setItem('hasUploadedData', 'true');

    } catch (err) {
        console.error(err);
        setUploadStatus("Upload failed.");
    }
};

// Add delete confirmation function
const confirmDeleteData = () => {
    if (window.confirm("Are you sure you want to delete all employee data? This action cannot be undone.")) {
        deleteEmployeeData();
    }
};

const deleteEmployeeData = async () => {
    try {
        // Clear local state
        setEmployeeData([]);
        setUploadStatus("");
        setUploadTime(null);
        setShowUploadCard(true);
        setMonthlyFile(null);
        setHasUploadedData(false);

        // Clear localStorage
        localStorage.removeItem('uploadStatus');
        localStorage.removeItem('uploadTime');
        localStorage.removeItem('monthlyFile');
        localStorage.removeItem('hasUploadedData');

        // Optional: Clear backend data too
        // await fetch("http://localhost:8000/monthly_sheet/clear_data", { method: "DELETE" });

        toast.success("Employee data cleared successfully.");
    } catch (err) {
        console.error(err);
        toast.error("Failed to clear data.");
    }
};