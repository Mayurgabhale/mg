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


from fastapi.middleware.cors import CORSMiddleware
from monthly_sheet import router as monthly_router


# add this in main.py (near the monthly_router inclusion)
from daily_sheet import router as daily_router
# app.include_router(daily_router)

app = FastAPI(title="Employee Travel Dashboard — Parser")
app.include_router(monthly_router)
app.include_router(daily_router)
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





# Travel-Backend\monthly_sheet.py
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


# daily_sheet.py
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy import Column, Integer, String
from io import BytesIO, StringIO
import pandas as pd
import numpy as np
from datetime import datetime
from dateutil import parser as date_parser
import re, zoneinfo, logging
from typing import Optional

# Import DB Base/engine/SessionLocal and Employee model + VIP_LEVELS from monthly_sheet
# Make sure monthly_sheet exports: Base, engine, SessionLocal, Employee, VIP_LEVELS
from monthly_sheet import Base, engine, SessionLocal, Employee, VIP_LEVELS




logger = logging.getLogger("uvicorn.error")

router = APIRouter(prefix="/daily_sheet", tags=["daily_sheet"])

# Use same server timezone as main.py
SERVER_TZ = zoneinfo.ZoneInfo("Asia/Kolkata")

# ---------------------------
# Model
# ---------------------------
class DailyTravel(Base):
    __tablename__ = "daily_travel"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    emp_id = Column(String, index=True, nullable=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    from_location = Column(String, nullable=True)
    to_location = Column(String, nullable=True)
    begin_date = Column(String, nullable=True)
