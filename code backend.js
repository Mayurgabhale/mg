[notice] A new release of pip is available: 25.2 -> 25.3
[notice] To update, run: python.exe -m pip install --upgrade pip
(venv) PS C:\Users\W0024618\Desktop\IncidentDashboard\Backend> uvicorn main:app --reload --port 8000
INFO:     Will watch for changes in these directories: ['C:\\Users\\W0024618\\Desktop\\IncidentDashboard\\Backend']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [23904] using StatReload
ERROR:    Error loading ASGI app. Attribute "app" not found in module "main".


          
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from incident_report import router as incident_router

app = FastAPI(title="Incident Reporting API")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # add other origins if frontend hosted elsewhere
]




# incident_report.py
import os
import json
from typing import Optional, List
from datetime import datetime, date, time

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel, Field, EmailStr, validator
from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.dialects.sqlite import JSON as SQLITE_JSON

from database import Base, engine, SessionLocal

router = APIRouter(prefix="/incident", tags=["incident"])

# Ensure uploads directory exists
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# -------------------------
# SQLAlchemy model
# -------------------------
class IncidentReport(Base):
    __tablename__ = "incident_reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # basic fields (strings)
    type_of_incident = Column(String, nullable=False)   # e.g. Medical / Theft / Other
    other_type_text = Column(String, nullable=True)     # filled when type_of_incident == "Other"

    date_of_report = Column(String, nullable=False)     # ISO date string e.g. "2025-12-03"
    time_of_report = Column(String, nullable=False)     # HH:MM

    impacted_name = Column(String, nullable=False)
    impacted_employee_id = Column(String, nullable=False)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(incident_router)

@app.get("/")
def read_root():
    return {"message": "Incident Reporting Backend is running"}
