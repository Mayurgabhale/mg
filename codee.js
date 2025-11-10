# monthly_sheet.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from sqlalchemy import create_engine, Column, String, Integer, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from io import BytesIO
import pandas as pd

router = APIRouter(prefix="/monthly_sheet", tags=["monthly_sheet"])

# --- DATABASE SETUP (same as before) ---
DATABASE_URL = "sqlite:///./database.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

# ... define Employee model and Base.metadata.create_all(bind=engine) here ...

# Then register your endpoints on `router` instead of app:

@router.post("/upload_monthly")
async def upload_monthly(file: UploadFile = File(...)):
    # your upload code (unchanged) ...
    return {"message": f"{len(df)} employee records saved successfully to SQLite database."}

@router.get("/employees")
def get_all_employees():
    session = SessionLocal()
    employees = session.query(Employee).all()
    session.close()
    return [ {k:v for k,v in e.__dict__.items() if k!='_sa_instance_state'} for e in employees ]

@router.get("/employee/{emp_id}")
def get_employee(emp_id: str):
    session = SessionLocal()
    emp = session.query(Employee).filter(Employee.employee_id == emp_id).first()
    session.close()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {k:v for k,v in emp.__dict__.items() if k!='_sa_instance_state'}