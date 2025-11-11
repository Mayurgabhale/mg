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