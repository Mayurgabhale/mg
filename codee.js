not work 

C:\Users\W0024618\Desktop\swipeData\Travel-Backend\monthly_sheet.py
# C:\Users\W0024618\Desktop\swipeData\Travel-Backend\employee_db.py

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String, Integer, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from io import BytesIO
import pandas as pd

# =======================
#   APP CONFIG
# =======================
app = FastAPI(title="Employee Master Sheet — SQLite Storage")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# Create tables
Base.metadata.create_all(bind=engine)


# =======================
#   API ENDPOINTS
# =======================

@app.post("/upload_monthly")
async def upload_monthly(file: UploadFile = File(...)):
    """
    Upload the monthly employee Excel or CSV sheet and store data into SQLite.
    """
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

    # Optional: clear old data before inserting new
    session.query(Employee).delete()

    # Insert new data
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


@app.get("/employees")
def get_all_employees():
    session = SessionLocal()
    employees = session.query(Employee).all()
    session.close()
    return [e.__dict__ for e in employees]



@app.get("/employee/{emp_id}")
def get_employee(emp_id: str):
    session = SessionLocal()
    emp = session.query(Employee).filter(Employee.employee_id == emp_id).first()
    session.close()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp.__dict__



C:\Users\W0024618\Desktop\swipeData\Travel-Backend\main.py



from datetime import datetime
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import numpy as np
from io import BytesIO, StringIO
from dateutil import parser
from datetime import datetime
import re, zoneinfo
from pydantic import BaseModel
from typing import Optional


# #################

from monthly_sheet import app as monthly_sheet


app = FastAPI(title="Employee Travel Dashboard — Parser")
app.mount("/monthly_sheet", monthly_sheet)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SERVER_TZ = zoneinfo.ZoneInfo("Asia/Kolkata")

# ✅ Global variable to store previous data
previous_data = {
    "summary": None,
    "items": None
}

# ✅ 1. Normalizes and parses date safely
def normalize_and_parse(dt_val):
    if pd.isna(dt_val):
        return None
    s = str(dt_val).strip()
    s = re.sub(r"(\d{1,2})\.(\d{1,2})(?!\d)", r"\1:\2", s)
    try:
        dt = parser.parse(s, dayfirst=False)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=SERVER_TZ)
        return dt.astimezone(zoneinfo.ZoneInfo("UTC"))
    except Exception:
        return None
    

    # ✅ 2. Smart universal reader for Excel/CSV (auto-detect header row)
def read_any_format(content: bytes, filename: str) -> pd.DataFrame:
    EXPECTED_COLS = [
        "AGENCY ID","AGENCY NAME","LAST NAME","FIRST NAME","TRAVELER",
        "EMP ID","EMAIL","PNR","LEG TYPE","BEGIN DATE","FROM LOCATION",
        "FROM COUNTRY","END DATE","TO LOCATION","TO COUNTRY"
    ]

    # --- CSV ---
    if filename.lower().endswith(".csv"):
        text = content.decode(errors="ignore").splitlines()
        header_row = None
        for i, line in enumerate(text[:50]):  # check first 50 lines
            if any(h.lower() in line.lower() for h in EXPECTED_COLS):
                header_row = i
                break
        if header_row is None:
            raise ValueError("Header row not found in CSV file")
        df = pd.read_csv(StringIO("\n".join(text)), skiprows=header_row)

    # --- Excel ---
    else:
        bio = BytesIO(content)
        preview = pd.read_excel(bio, header=None, nrows=50)
        header_row = None
        for i in range(len(preview)):
            joined = " ".join(str(v).strip().lower() for v in preview.iloc[i].values if pd.notna(v))
            if any(h.lower() in joined for h in EXPECTED_COLS):
                header_row = i
                break
        if header_row is None:
            raise ValueError("Header row not found in Excel file")
        bio.seek(0)
        df = pd.read_excel(bio, header=header_row)

    # --- Normalize headers ---
    df.columns = [str(c).strip().upper() for c in df.columns]

    # --- Ensure all expected columns exist ---
    for col in EXPECTED_COLS:
        if col not in df.columns:
            df[col] = None
