now give me backned strcute also venv 
C:\Users\W0024618\Desktop\IncidentDashboard\Backend

# incident_report.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, validator
from typing import Optional, List, Any
from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.dialects.sqlite import JSON as SQLITE_JSON  # maps to TEXT in SQLite
from datetime import datetime, date
import zoneinfo
import json

# reuse DB Base/engine/SessionLocal exported from monthly_sheet
from monthly_sheet import Base, engine, SessionLocal

router = APIRouter(prefix="/incident", tags=["incident"])

SERVER_TZ = zoneinfo.ZoneInfo("Asia/Kolkata")

# -------------------------
# SQLAlchemy model
# -------------------------
class IncidentReport(Base):
    __tablename__ = "incident_reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    type_of_incident = Column(String, nullable=True)   # Medical / Theft / ...
    date_of_report = Column(String, nullable=True)     # stored as ISO date string
    time_of_report = Column(String, nullable=True)     # HH:MM
    impacted_name = Column(String, nullable=True)
    impacted_employee_id = Column(String, nullable=True)
    was_reported_verbally = Column(Integer, default=0)  # 1 = Yes, 0 = No
    # if yes: who it was reported to (list of choices) and details about to-whom
    incident_reported_to = Column(String, nullable=True)   # CSV or JSON string
    reported_to_details = Column(String, nullable=True)    # "If yes, to whom (Name and Department)"
    # common fields
    location = Column(String, nullable=True)  # Location of Incident or Accident (Office / Branch)
    reported_by_name = Column(String, nullable=True)
    reported_by_employee_id = Column(String, nullable=True)
    reported_by_contact = Column(String, nullable=True)
    date_of_incident = Column(String, nullable=True)    # ISO date string
    time_of_incident = Column(String, nullable=True)
    detailed_description = Column(Text, nullable=True)
    immediate_actions_taken = Column(Text, nullable=True)
    accompanying_person = Column(SQLITE_JSON, nullable=True)   # JSON array or null
    witnesses = Column(SQLITE_JSON, nullable=True)            # JSON array
    witness_contacts = Column(SQLITE_JSON, nullable=True)     # JSON array
    root_cause_analysis = Column(Text, nullable=True)
    preventive_actions = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.now)

# ensure table exists
Base.metadata.create_all(bind=engine)

# -------------------------
# Pydantic Schemas
# -------------------------
class IncidentCreate(BaseModel):
    type_of_incident: Optional[str]
    date_of_report: Optional[str]      # allow ISO string or plain date string
    time_of_report: Optional[str]      # "HH:MM"
    impacted_name: Optional[str]
    impacted_employee_id: Optional[str]
    was_reported_verbally: bool
    # if was_reported_verbally == True:
    incident_reported_to: Optional[List[str]] = None
    reported_to_details: Optional[str] = None

    # fields used in both branches
    location: Optional[str] = None
    reported_by_name: Optional[str] = None
    reported_by_employee_id: Optional[str] = None
    reported_by_contact: Optional[str] = None
    date_of_incident: Optional[str] = None
    time_of_incident: Optional[str] = None
    detailed_description: Optional[str] = None
    immediate_actions_taken: Optional[str] = None
    accompanying_person: Optional[List[dict]] = None
    witnesses: Optional[List[str]] = None
    witness_contacts: Optional[List[str]] = None
    root_cause_analysis: Optional[str] = None
    preventive_actions: Optional[str] = None

    @validator("incident_reported_to", always=True)
    def validate_reported_to(cls, v, values):
        # When was_reported_verbally is True, incident_reported_to must be provided (at least one)
        if values.get("was_reported_verbally"):
            if not v or not isinstance(v, list) or len(v) == 0:
                raise ValueError("When was_reported_verbally is True, provide incident_reported_to (list of options).")
        return v

    @validator("reported_to_details", always=True)
    def validate_reported_to_details(cls, v, values):
        # recommended to provide details when was_reported_verbally is True
        if values.get("was_reported_verbally"):
            # not strictly required, but warn/require: here we require at least an empty string allowed
            if v is None:
                return ""  # keep DB field non-null if caller omits
        return v

class IncidentOut(BaseModel):
    id: int
    type_of_incident: Optional[str]
    date_of_report: Optional[str]
    time_of_report: Optional[str]
    impacted_name: Optional[str]
    impacted_employee_id: Optional[str]
    was_reported_verbally: bool
    incident_reported_to: Optional[List[str]] = None
    reported_to_details: Optional[str] = None
    location: Optional[str] = None
    reported_by_name: Optional[str] = None
    reported_by_employee_id: Optional[str] = None
    reported_by_contact: Optional[str] = None
    date_of_incident: Optional[str] = None
    time_of_incident: Optional[str] = None
    detailed_description: Optional[str] = None
    immediate_actions_taken: Optional[str] = None
    accompanying_person: Optional[List[dict]] = None
    witnesses: Optional[List[str]] = None
    witness_contacts: Optional[List[str]] = None
    root_cause_analysis: Optional[str] = None
    preventive_actions: Optional[str] = None
    created_at: Optional[datetime]

    class Config:
        orm_mode = True

# -------------------------
# Endpoints
# -------------------------     
@router.post("/create", response_model=IncidentOut)
def create_incident(payload: IncidentCreate):
    """
    Create a new incident record.
    Validation: enforces incident_reported_to when was_reported_verbally is True.
    """
    db = SessionLocal()
    try:
        inst = IncidentReport(
            type_of_incident = payload.type_of_incident,
            date_of_report = payload.date_of_report,
            time_of_report = payload.time_of_report,
            impacted_name = payload.impacted_name,
            impacted_employee_id = payload.impacted_employee_id,
            was_reported_verbally = 1 if payload.was_reported_verbally else 0,
            incident_reported_to = json.dumps(payload.incident_reported_to) if payload.incident_reported_to else None,
            reported_to_details = payload.reported_to_details,
            location = payload.location,
            reported_by_name = payload.reported_by_name,
            reported_by_employee_id = payload.reported_by_employee_id,
            reported_by_contact = payload.reported_by_contact,
            date_of_incident = payload.date_of_incident,
            time_of_incident = payload.time_of_incident,
            detailed_description = payload.detailed_description,
            immediate_actions_taken = payload.immediate_actions_taken,
            accompanying_person = payload.accompanying_person,
            witnesses = payload.witnesses,
            witness_contacts = payload.witness_contacts,
            root_cause_analysis = payload.root_cause_analysis,
            preventive_actions = payload.preventive_actions,
            created_at = datetime.now(tz=SERVER_TZ)
        )
        db.add(inst)
        db.commit()
        db.refresh(inst)

        # convert JSON-string fields back to Python lists for response_model
        out = inst
        try:
            if out.incident_reported_to:
                out.incident_reported_to = json.loads(out.incident_reported_to)
        except Exception:
            out.incident_reported_to = None

        return out
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.get("/list", response_model=List[IncidentOut])
def list_incidents(limit: int = 200):
    db = SessionLocal()
    try:
        rows = db.query(IncidentReport).order_by(IncidentReport.created_at.desc()).limit(limit).all()
        # convert JSON-string incident_reported_to to list
        for r in rows:
            try:
                if isinstance(r.incident_reported_to, str):
                    r.incident_reported_to = json.loads(r.incident_reported_to)
            except Exception:
                r.incident_reported_to = None
        return rows
    finally:
        db.close()


@router.get("/{incident_id}", response_model=IncidentOut)
def get_incident(incident_id: int):
    db = SessionLocal()
    try:
        row = db.query(IncidentReport).filter(IncidentReport.id == incident_id).first()
        if not row:
            raise HTTPException(status_code=404, detail="Incident not found")
        try:
            if isinstance(row.incident_reported_to, str):
                row.incident_reported_to = json.loads(row.incident_reported_to)
        except Exception:
            row.incident_reported_to = None
        return row
    finally:
        db.close()
