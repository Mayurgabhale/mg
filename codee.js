uploadMonthly now this create..
1. Upload Monthly Active Sheet
Upload the latest monthly employee file  << this i want ot show in left side ok 
2.. then upload buttion wher i clikc on this upload buttion i want to thie area comes in pop up, then we upload the file ok
3.. after upload we dont show agan the upload buttion 
4.. after uplado succes then i want to show all inforamtin ,,, 
    uplodate data and records ,,
5.. i want delete sheete buttion wiht confernt messae... after delte then again show uplaod sheet option ok 


{activeTab === "uploadMonthly" && (
    <div style={styles.uploadContainer}>
        <div style={styles.uploadHeader}>
            <div style={styles.headerLeft}>
                <div style={styles.uploadIcon}>
                    <FiUpload size={32} />
                </div>
                <div>
                    <h2 style={styles.uploadTitle}>Upload Monthly Active Sheet</h2>
                    <p style={styles.uploadSubtitle}>
                        Upload the latest monthly employee file
                    </p>
                </div>
            </div>
            {employeeData.length > 0 && (
                <div style={styles.headerStats}>
                    <div style={styles.statCard}>
                        <FiDatabase size={20} />
                        <div>
                            <span style={styles.statNumber}>{employeeData.length}</span>
                            <span style={styles.statLabel}>Employees</span>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {showUploadCard && employeeData.length === 0 && (
            <div style={styles.uploadCard}>
                <div style={styles.uploadArea}>
                    <FiUploadCloud size={48} style={styles.uploadCloudIcon} />
                    <h3 style={styles.uploadAreaTitle}>Drop your file here</h3>
                    <p style={styles.uploadAreaSubtitle}>Supports .xlsx, .xls, .csv files up to 10MB</p>

                    <label htmlFor="monthly-file-upload" style={styles.fileInputLabel}>
                        <FiFolder style={{ marginRight: 8 }} />
                        Choose File
                    </label>
                    <input
                        id="monthly-file-upload"
                        type="file"
                        onChange={handleMonthlyFileChange}
                        style={styles.hiddenFileInput}
                        accept=".xlsx,.xls,.csv"
                    />

                    {monthlyFile && (
                        <div style={styles.filePreview}>
                            <FiFile style={styles.fileIcon} />
                            <div style={styles.fileInfo}>
                                <span style={styles.fileName}>{monthlyFile.name}</span>
                                <span style={styles.fileSize}>
                                    {(monthlyFile.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                            </div>
                            <button
                                onClick={() => setMonthlyFile(null)}
                                style={styles.removeFileButton}
                            >
                                <FiX />
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={uploadMonthlySheet}
                    disabled={!monthlyFile || uploadStatus?.includes('Uploading')}
                    style={!monthlyFile ? styles.uploadButtonDisabled : styles.uploadButton}
                >
                    {uploadStatus?.includes('Uploading') ? (
                        <>
                            <FiLoader size={16} style={{ marginRight: 8, animation: 'spin 1s linear infinite' }} />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <FiUpload style={{ marginRight: 8 }} />
                            Process Upload
                        </>
                    )}
                </button>
            </div>
        )}

        {(uploadStatus || employeeData.length > 0) && (
            <div style={uploadStatus?.includes('Error') ? styles.uploadStatusError : styles.uploadStatusSuccess}>
                <div style={styles.statusHeader}>
                    {uploadStatus?.includes('Error') ? <FiAlertCircle size={20} /> : <FiCheckCircle size={20} />}
                    <span style={styles.statusTitle}>
                        {uploadStatus?.includes('Error') ? 'Upload Failed' : 'Data Loaded Successfully'}
                    </span>
                    {!uploadStatus?.includes('Error') && employeeData.length > 0 && (
                        <button
                            onClick={confirmDeleteData}
                            style={styles.deleteButton}
                            title="Delete uploaded data"
                        >
                            <FiTrash2 size={16} />
                        </button>
                    )}
                </div>
                <p style={styles.statusMessage}>
                    {uploadStatus || `${employeeData.length} employee records loaded from previous session.`}
                </p>

                {monthlyFile && uploadTime && (
                    <div style={styles.metadataGrid}>
                        <div style={styles.metadataItem}>
                            <span style={styles.metadataLabel}>File Name</span>
                            <span style={styles.metadataValue}>{monthlyFile.name}</span>
                        </div>
                        <div style={styles.metadataItem}>
                            <span style={styles.metadataLabel}>File Size</span>
                            <span style={styles.metadataValue}>
                                {(monthlyFile.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                        </div>
                        <div style={styles.metadataItem}>
                            <span style={styles.metadataLabel}>Upload Date & Time</span>
                            <span style={styles.metadataValue}>
                                {uploadTime.toLocaleDateString()} at {uploadTime.toLocaleTimeString()}
                            </span>
                        </div>
                        <div style={styles.metadataItem}>
                            <span style={styles.metadataLabel}>Records Processed</span>
                            <span style={styles.metadataValue}>{employeeData.length} employees</span>
                        </div>
                        <div style={styles.metadataItem}>
                            <span style={styles.metadataLabel}>File Type</span>
                            <span style={styles.metadataValue}>{monthlyFile.name.split('.').pop().toUpperCase()}</span>
                        </div>
                        <div style={styles.metadataItem}>
                            <span style={styles.metadataLabel}>Database</span>
                            <span style={styles.metadataValue}>SQLite</span>
                        </div>
                        <div style={styles.metadataItem}>
                            <span style={styles.metadataLabel}>Data Status</span>
                            <span style={styles.metadataValue}>
                                <div style={styles.persistedBadge}>
                                    <FiSave style={{ marginRight: 4 }} />
                                    Persisted
                                </div>
                            </span>
                        </div>
                    </div>
                )}
            </div>
        )}

        {employeeData.length > 0 && (
            <div style={styles.summaryCard}>
                <div style={styles.summaryHeader}>
                    <h3 style={styles.summaryTitle}>Upload Summary</h3>
                    <div style={styles.summaryStats}>
                        <div style={styles.summaryStat}>
                            <FiUsers style={styles.summaryIcon} />
                            <span style={styles.summaryNumber}>{employeeData.length}</span>
                            <span style={styles.summaryLabel}>Total Employees</span>
                        </div>
                        <div style={styles.summaryStat}>
                            <FiMapPin style={styles.summaryIcon} />
                            <span style={styles.summaryNumber}>
                                {new Set(employeeData.map(emp => emp.location_city)).size}
                            </span>
                            <span style={styles.summaryLabel}>Locations</span>
                        </div>
                        <div style={styles.summaryStat}>
                            <FiBriefcase style={styles.summaryIcon} />
                            <span style={styles.summaryNumber}>
                                {new Set(employeeData.map(emp => emp.department_name)).size}
                            </span>
                            <span style={styles.summaryLabel}>Departments</span>
                        </div>
                        <div style={styles.summaryStat}>
                            <FaBuilding style={styles.summaryIcon} />
                            <span style={styles.summaryNumber}>
                                {new Set(employeeData.map(emp => emp.company_name)).size}
                            </span>
                            <span style={styles.summaryLabel}>Companies</span>
                        </div>
                    </div>
                </div>
            </div>
        )}

        
    </div>
)} 




// 📝📝📝📝📝📝📝
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
        // Clear backend data first
        try {
            const clearRes = await fetch("http://localhost:8000/monthly_sheet/clear_data", { 
                method: "DELETE" 
            });
            const result = await clearRes.json();
            console.log("Backend clear result:", result);
        } catch (backendErr) {
            console.warn("Backend clear failed, continuing with frontend clear:", backendErr);
        }

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

        toast.success("Employee data cleared successfully.");
    } catch (err) {
        console.error(err);
        toast.error("Failed to clear data.");
    }
};
    // 📝📝📝📝📝📝📝






from fastapi import APIRouter, UploadFile, File, HTTPException
from sqlalchemy import create_engine, Column, String, Integer, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from io import BytesIO
import pandas as pd
from datetime import datetime

# =======================
#   ROUTER CONFIG
# =======================
router = APIRouter(prefix="/monthly_sheet", tags=["monthly_sheet"])

# =======================
#   DATABASE CONFIG
# =======================
DATABASE_URL = "sqlite:///./database.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

# =======================
#   GLOBAL VARIABLE TO STORE UPLOAD INFO
# =======================
last_upload_info = {"message": None, "uploaded_at": None}

# =======================
#   EMPLOYEE MODEL
# =======================
class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    employee_id = Column(String, index=True)
    last_name = Column(String)
    first_name = Column(String)
    preferred_first_name = Column(String)
    middle_name = Column(String)
    full_name = Column(String)
    current_status = Column(String)
    employee_type = Column(String)
    hire_date = Column(String)
    job_code = Column(String)
    position_id = Column(String)
    business_title = Column(String)
    department_name = Column(String)
    company_name = Column(String)
    work_country = Column(String)
    location_description = Column(String)
    location_city = Column(String)
    management_level = Column(String)
    manager_name = Column(String)
    employee_email = Column(String)
    manager_email = Column(String)
    fte = Column(Float)
    tenure = Column(String)
    years_of_service = Column(Float)
    length_of_service_months = Column(Float)
    time_in_position_months = Column(Float)
    uploaded_at = Column(String, nullable=True)  # ✅ shared upload timestamp

# Create table if not exists
Base.metadata.create_all(bind=engine)

# =======================
#   VIP MANAGEMENT LEVELS
# =======================
VIP_LEVELS = {
    "Chief Exec Officer",
    "Executive Vice President",
    "Senior Vice President",
    "Vice President",
    "Upper Mid Mgmt / Director",
    "Middle Mgmt / Sr. Professional",
    "Supervisory / Professional",
}

# =======================
#   API ENDPOINTS
# =======================

@router.post("/upload_monthly")
async def upload_monthly(file: UploadFile = File(...)):
    """Upload the monthly employee Excel or CSV sheet and store data into SQLite."""
    if not file.filename.lower().endswith((".xlsx", ".xls", ".csv")):
        raise HTTPException(status_code=400, detail="Please upload a valid Excel or CSV file.")

    content = await file.read()

    # Read file content into DataFrame
    try:
        if file.filename.lower().endswith(".csv"):
            df = pd.read_csv(BytesIO(content))
        else:
            df = pd.read_excel(BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading file: {e}")

    # Normalize column names
    df.columns = [c.strip().replace(" ", "_").replace("/", "_").replace("-", "_") for c in df.columns]

    session = SessionLocal()
    session.query(Employee).delete()  # optional: clear old data

    # ✅ one shared timestamp for all records
    upload_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    for _, row in df.iterrows():
        emp = Employee(
            employee_id=str(row.get("Employee_ID", "")),
            last_name=row.get("Last_Name"),
            first_name=row.get("First_Name"),
            preferred_first_name=row.get("Preferred_First_Name"),
            full_name=row.get("Full_Name"),
            business_title=row.get("Business_Title"),
            management_level=row.get("Management_Level"),
            employee_email=row.get("Employee_s_Email"),
            manager_email=row.get("Manager_s_Email"),
            department_name=row.get("Department_Name"),
            company_name=row.get("Company_Name"),
            work_country=row.get("Work_Country"),
            location_description=row.get("Location_Description"),
            location_city=row.get("Location_City"),
            fte=float(row.get("FTE", 0)) if pd.notna(row.get("FTE")) else None,
            tenure=row.get("Tenure"),
            years_of_service=float(row.get("Years_of_Service", 0)) if pd.notna(row.get("Years_of_Service")) else None,
            length_of_service_months=float(row.get("Length_of_Service_in_Months", 0)) if pd.notna(row.get("Length_of_Service_in_Months")) else None,
            time_in_position_months=float(row.get("Time_in_Position_(Months)", 0)) if pd.notna(row.get("Time_in_Position_(Months)")) else None,
            uploaded_at=upload_time,  # ✅ shared timestamp for all records
        )
        session.add(emp)

    session.commit()
    session.close()

    # ✅ store in global info
    last_upload_info["message"] = f"{len(df)} employee records saved successfully."
    last_upload_info["uploaded_at"] = upload_time

    return last_upload_info


@router.get("/employees")
def get_all_employees():
    """Return all employees with last upload info and VIP status."""
    session = SessionLocal()
    employees = session.query(Employee).all()
    session.close()

    uploaded_at = employees[0].uploaded_at if employees else None

    def is_vip(level: str) -> bool:
        return level in VIP_LEVELS if level else False

    employee_list = []
    for e in employees:
        emp_dict = {k: v for k, v in e.__dict__.items() if k != "_sa_instance_state"}
        emp_dict["is_vip"] = is_vip(e.management_level)
        employee_list.append(emp_dict)

    return {
        "message": last_upload_info["message"],
        "uploaded_at": uploaded_at,
        "employees": employee_list,
    }


@router.get("/employee/{emp_id}")
def get_employee(emp_id: str):
    """Return single employee with VIP status."""
    session = SessionLocal()
    emp = session.query(Employee).filter(Employee.employee_id == emp_id).first()
    session.close()

    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    emp_dict = {k: v for k, v in emp.__dict__.items() if k != "_sa_instance_state"}
    emp_dict["is_vip"] = emp.management_level in VIP_LEVELS if emp.management_level else False
    return emp_dict


@router.delete("/clear_data")
def clear_employee_data():
    """Clear all employee data from the database."""
    session = SessionLocal()
    try:
        count_before = session.query(Employee).count()
        session.query(Employee).delete()
        session.commit()
        return {"message": f"Successfully cleared {count_before} employee records from database."}
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Error clearing data: {e}")
    finally:
        session.close()
