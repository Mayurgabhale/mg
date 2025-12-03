1.Type of Incident / Accident * ( this is select box )
•	Medical 
•	Theft 
•	Fire 
•	HR Related Incident 
•	Outside Work Place Violence 
•	Threat 
•	Death 
•	Fraud 
•	Any Other Safety / Security Related Incident 
•	Other – 
Enter your answer
2.Date of Report *
3.Time of Report (HH:MM) *
4.Name of Impacted Employee / Person *
5.Employee ID of Impacted Employee *
6.Was this incident reported verbally before submitting this report? *
 ** In case of medical emergency inform local HR 
•	Yes
•	No

If Yes then
7.Incident reported to:  * ( this is select box )
•	Supervisor
•	Manager
•	HR
•	Other Employee
•	Not Reported
8.If Yes, to whom ( Name and Department ): *
9.Location of Incident or Accident (Specify Office / Branch) *
10.Reported By - Name & Employee ID: *
11.Reported By - Employee email address *
12.Reported By - Contact Number *
13.Date of Incident Occurred *
14.Time of Incident *
15.Detailed Description of Incident (long ans) *
16.Immediate Actions Taken: (long ans) *
17.Accompanying Person Name and Contact Details *
18.Name of Witnesses or Employee present during the incident/accident: *
19.Contact Number - Witness or Employee *
20.Root cause analysis of the incident/accident:
21.Preventive actions taken during or after incident/accident (If any):
Submit 

If No then 
7.Location of Incident or Accident (Specify Office / Branch) *
8.Reported By - Name & Employee ID: *
9. Reported By - Employee email address *
10.Reported By - Contact Number *
11.Date of Incident Occurred *
12.Time of Incident  *
13.Detailed Description of Incident  (long ans) *
14.Immediate Actions Taken: (long ans) *
15.Accompanying Person Name and Contact Details *
16.Name of Witnesses or Employee present during the incident/accident: *
17.Contact Number - Witness or Employee *
18.Root cause analysis of the incident/accident:
19.Preventive actions taken during or after incident/accident (If any):                                                                       Submit 

  Print (IN pdf) 

this data i want to store in data in probar formate and strict type ok string to string inter ge data boold to bool ok like 
and one more thing is to , proof for this we can you photos, image , or pdf any thing ok one ro extrac column of this ok 
and all fild are requie only 
18.Root cause analysis of the incident/accident:
19.Preventive actions taken during or after incident/accident (If any):    
this is in option ok 

so wrtie the code like that ok, 

give me this code with correct improve verson carefully
# incident_report.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, validator
from typing import Optional, List
from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.dialects.sqlite import JSON as SQLITE_JSON
from datetime import datetime
import json

from database import Base, engine, SessionLocal  # <-- ensure you import your DB

router = APIRouter(prefix="/incident", tags=["incident"])

# -------------------------
# SQLAlchemy Model
# -------------------------
class IncidentReport(Base):
    __tablename__ = "incident_reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    type_of_incident = Column(String, nullable=True)
    date_of_report = Column(String, nullable=True)
    time_of_report = Column(String, nullable=True)
    impacted_name = Column(String, nullable=True)
    impacted_employee_id = Column(String, nullable=True)
    was_reported_verbally = Column(Integer, default=0)
    incident_reported_to = Column(String, nullable=True)
    reported_to_details = Column(String, nullable=True)
    location = Column(String, nullable=True)
    reported_by_name = Column(String, nullable=True)
    reported_by_employee_id = Column(String, nullable=True)
    reported_by_contact = Column(String, nullable=True)
    date_of_incident = Column(String, nullable=True)
    time_of_incident = Column(String, nullable=True)
    detailed_description = Column(Text, nullable=True)
    immediate_actions_taken = Column(Text, nullable=True)
    accompanying_person = Column(SQLITE_JSON, nullable=True)
    witnesses = Column(SQLITE_JSON, nullable=True)
    witness_contacts = Column(SQLITE_JSON, nullable=True)
    root_cause_analysis = Column(Text, nullable=True)
    preventive_actions = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)   # FIXED (No timezone needed)

# create table
Base.metadata.create_all(bind=engine)

# -------------------------
# Pydantic Schemas
# -------------------------
class IncidentCreate(BaseModel):
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

    @validator("incident_reported_to", always=True)
    def validate_reported_to(cls, v, values):
        if values.get("was_reported_verbally") and (not v or len(v) == 0):
            raise ValueError("Provide incident_reported_to when was_reported_verbally is True.")
        return v

    @validator("reported_to_details", always=True)
    def validate_reported_to_details(cls, v, values):
        if values.get("was_reported_verbally") and v is None:
            return ""
        return v

class IncidentOut(BaseModel):
    id: int
    type_of_incident: Optional[str]
    date_of_report: Optional[str]
    time_of_report: Optional[str]
    impacted_name: Optional[str]
    impacted_employee_id: Optional[str]
    was_reported_verbally: bool
    incident_reported_to: Optional[List[str]]
    reported_to_details: Optional[str]
    location: Optional[str]
    reported_by_name: Optional[str]
    reported_by_employee_id: Optional[str]
    reported_by_contact: Optional[str]
    date_of_incident: Optional[str]
    time_of_incident: Optional[str]
    detailed_description: Optional[str]
    immediate_actions_taken: Optional[str]
    accompanying_person: Optional[List[dict]]
    witnesses: Optional[List[str]]
    witness_contacts: Optional[List[str]]
    root_cause_analysis: Optional[str]
    preventive_actions: Optional[str]
    created_at: Optional[datetime]

    class Config:
        orm_mode = True


# -------------------------
# Endpoints
# -------------------------     
@router.post("/create", response_model=IncidentOut)
def create_incident(payload: IncidentCreate):
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
        )
        db.add(inst)
        db.commit()
        db.refresh(inst)

        # convert JSON fields
        if inst.incident_reported_to:
            inst.incident_reported_to = json.loads(inst.incident_reported_to)

        return inst

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

        for r in rows:
            if isinstance(r.incident_reported_to, str):
                try:
                    r.incident_reported_to = json.loads(r.incident_reported_to)
                except:
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

        if isinstance(row.incident_reported_to, str):
            try:
                row.incident_reported_to = json.loads(row.incident_reported_to)
            except:
                row.incident_reported_to = None

        return row
    finally:
        db.close()

------
    # database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./database.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()



