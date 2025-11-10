Uncaught runtime errors:
×
ERROR
Failed to execute 'setItem' on 'Storage': Setting the value of 'employeeData' exceeded the quota.
QuotaExceededError: Failed to execute 'setItem' on 'Storage': Setting the value of 'employeeData' exceeded the quota.
    at http://localhost:3001/main.ff6fe097137270314622.hot-update.js:138:20
    at react-stack-bottom-frame (http://localhost:3001/static/js/bundle.js:37142:18)
    at runWithFiberInDEV (http://localhost:3001/static/js/bundle.js:25061:68)
    at commitHookEffectListMount (http://localhost:3001/static/js/bundle.js:30051:618)
    at commitHookPassiveMountEffects (http://localhost:3001/static/js/bundle.js:30088:56)
    at commitPassiveMountOnFiber (http://localhost:3001/static/js/bundle.js:30990:25)
    at recursivelyTraversePassiveMountEffects (http://localhost:3001/static/js/bundle.js:30981:104)
    at commitPassiveMountOnFiber (http://localhost:3001/static/js/bundle.js:31030:9)
    at recursivelyTraversePassiveMountEffects (http://localhost:3001/static/js/bundle.js:30981:104)
    at commitPassiveMountOnFiber (http://localhost:3001/static/js/bundle.js:30989:9)

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
};\





from fastapi import APIRouter, UploadFile, File, HTTPException
from sqlalchemy import create_engine, Column, String, Integer, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from io import BytesIO
import pandas as pd

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

# Create table if not exists
Base.metadata.create_all(bind=engine)


# =======================
#   API ENDPOINTS
# =======================
@router.post("/upload_monthly")
async def upload_monthly(file: UploadFile = File(...)):
    """Upload the monthly employee Excel or CSV sheet and store data into SQLite."""
    if not file.filename.lower().endswith((".xlsx", ".xls", ".csv")):
        raise HTTPException(status_code=400, detail="Please upload a valid Excel or CSV file.")

    content = await file.read()

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
        )
        session.add(emp)

    session.commit()
    session.close()

    return {"message": f"{len(df)} employee records saved successfully to SQLite database."}


@router.get("/employees")
def get_all_employees():
    session = SessionLocal()
    employees = session.query(Employee).all()
    session.close()
    return [
        {k: v for k, v in e.__dict__.items() if k != "_sa_instance_state"}
        for e in employees
    ]


@router.get("/employee/{emp_id}")
def get_employee(emp_id: str):
    session = SessionLocal()
    emp = session.query(Employee).filter(Employee.employee_id == emp_id).first()
    session.close()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {k: v for k, v in emp.__dict__.items() if k != "_sa_instance_state"}
