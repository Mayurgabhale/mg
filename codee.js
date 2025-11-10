const [employeeData, setEmployeeData] = useState([]);
const [monthlyFile, setMonthlyFile] = useState(null);
const [uploadStatus, setUploadStatus] = useState("");
const [uploadTime, setUploadTime] = useState(null);
const [showUploadCard, setShowUploadCard] = useState(true);

// Load data from localStorage on component mount
useEffect(() => {
    const savedEmployeeData = localStorage.getItem('employeeData');
    const savedUploadStatus = localStorage.getItem('uploadStatus');
    const savedUploadTime = localStorage.getItem('uploadTime');
    const savedMonthlyFile = localStorage.getItem('monthlyFile');

    if (savedEmployeeData) {
        setEmployeeData(JSON.parse(savedEmployeeData));
    }
    if (savedUploadStatus) {
        setUploadStatus(savedUploadStatus);
    }
    if (savedUploadTime) {
        setUploadTime(new Date(savedUploadTime));
    }
    if (savedMonthlyFile) {
        setMonthlyFile(JSON.parse(savedMonthlyFile));
    }
    
    // Hide upload card if we have existing data
    if (savedEmployeeData && JSON.parse(savedEmployeeData).length > 0) {
        setShowUploadCard(false);
    }
}, []);

// Save to localStorage whenever state changes
useEffect(() => {
    if (employeeData.length > 0) {
        localStorage.setItem('employeeData', JSON.stringify(employeeData));
    }
}, [employeeData]);

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
        setUploadTime(new Date()); // Set upload time

        // Hide upload card after successful upload
        setShowUploadCard(false);

        // Fetch employee data after successful upload
        const employeesRes = await fetch("http://localhost:8000/monthly_sheet/employees");
        const employeesData = await employeesRes.json();
        setEmployeeData(employeesData);

        // Save to localStorage
        localStorage.setItem('employeeData', JSON.stringify(employeesData));
        localStorage.setItem('uploadStatus', result.message || "Upload success!");
        localStorage.setItem('uploadTime', new Date().toISOString());
        localStorage.setItem('monthlyFile', JSON.stringify({
            name: monthlyFile.name,
            size: monthlyFile.size,
            type: monthlyFile.type,
            lastModified: monthlyFile.lastModified
        }));

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

        // Clear localStorage
        localStorage.removeItem('employeeData');
        localStorage.removeItem('uploadStatus');
        localStorage.removeItem('uploadTime');
        localStorage.removeItem('monthlyFile');

        toast.success("Employee data cleared successfully.");
    } catch (err) {
        console.error(err);
        toast.error("Failed to clear data.");
    }
};