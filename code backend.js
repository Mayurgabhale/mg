(venv) C:\Users\W0024618\Desktop\IncidentDashboard\Backend>uvicorn main:app --reload --port 8000
INFO:     Will watch for changes in these directories: ['C:\\Users\\W0024618\\Desktop\\IncidentDashboard\\Backend']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [38808] using StatReload
Process SpawnProcess-1:
Traceback (most recent call last):
  File "C:\Program Files\Python313\Lib\zoneinfo\_common.py", line 12, in load_tzdata
    return resources.files(package_name).joinpath(resource_name).open("rb")
           ~~~~~~~~~~~~~~~^^^^^^^^^^^^^^
  File "C:\Program Files\Python313\Lib\importlib\resources\_common.py", line 46, in wrapper
    return func(anchor)
  File "C:\Program Files\Python313\Lib\importlib\resources\_common.py", line 56, in files
    return from_package(resolve(anchor))
                        ~~~~~~~^^^^^^^^
  File "C:\Program Files\Python313\Lib\functools.py", line 934, in wrapper
    return dispatch(args[0].__class__)(*args, **kw)
           ~~~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^
  File "C:\Program Files\Python313\Lib\importlib\resources\_common.py", line 82, in _
    return importlib.import_module(cand)
           ~~~~~~~~~~~~~~~~~~~~~~~^^^^^^
  File "C:\Program Files\Python313\Lib\importlib\__init__.py", line 88, in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
           ~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "<frozen importlib._bootstrap>", line 1387, in _gcd_import
  File "<frozen importlib._bootstrap>", line 1360, in _find_and_load
  File "<frozen importlib._bootstrap>", line 1310, in _find_and_load_unlocked
  File "<frozen importlib._bootstrap>", line 488, in _call_with_frames_removed
  File "<frozen importlib._bootstrap>", line 1387, in _gcd_import
  File "<frozen importlib._bootstrap>", line 1360, in _find_and_load
  File "<frozen importlib._bootstrap>", line 1310, in _find_and_load_unlocked
  File "<frozen importlib._bootstrap>", line 488, in _call_with_frames_removed
  File "<frozen importlib._bootstrap>", line 1387, in _gcd_import
  File "<frozen importlib._bootstrap>", line 1360, in _find_and_load
  File "<frozen importlib._bootstrap>", line 1324, in _find_and_load_unlocked
ModuleNotFoundError: No module named 'tzdata'

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "C:\Program Files\Python313\Lib\multiprocessing\process.py", line 313, in _bootstrap
    self.run()
    ~~~~~~~~^^
  File "C:\Program Files\Python313\Lib\multiprocessing\process.py", line 108, in run
    self._target(*self._args, **self._kwargs)
    ~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\W0024618\Desktop\IncidentDashboard\Backend\venv\Lib\site-packages\uvicorn\_subprocess.py", line 80, in subprocess_started
    target(sockets=sockets)
    ~~~~~~^^^^^^^^^^^^^^^^^
  File "C:\Users\W0024618\Desktop\IncidentDashboard\Backend\venv\Lib\site-packages\uvicorn\server.py", line 67, in run
    return asyncio_run(self.serve(sockets=sockets), loop_factory=self.config.get_loop_factory())
  File "C:\Program Files\Python313\Lib\asyncio\runners.py", line 195, in run
    return runner.run(main)
           ~~~~~~~~~~^^^^^^
  File "C:\Program Files\Python313\Lib\asyncio\runners.py", line 118, in run
    return self._loop.run_until_complete(task)
           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^
  File "C:\Program Files\Python313\Lib\asyncio\base_events.py", line 725, in run_until_complete
    return future.result()
           ~~~~~~~~~~~~~^^
  File "C:\Users\W0024618\Desktop\IncidentDashboard\Backend\venv\Lib\site-packages\uvicorn\server.py", line 71, in serve
    await self._serve(sockets)
  File "C:\Users\W0024618\Desktop\IncidentDashboard\Backend\venv\Lib\site-packages\uvicorn\server.py", line 78, in _serve
    config.load()
    ~~~~~~~~~~~^^
  File "C:\Users\W0024618\Desktop\IncidentDashboard\Backend\venv\Lib\site-packages\uvicorn\config.py", line 439, in load
    self.loaded_app = import_from_string(self.app)
                      ~~~~~~~~~~~~~~~~~~^^^^^^^^^^
  File "C:\Users\W0024618\Desktop\IncidentDashboard\Backend\venv\Lib\site-packages\uvicorn\importer.py", line 19, in import_from_string
    module = importlib.import_module(module_str)
  File "C:\Program Files\Python313\Lib\importlib\__init__.py", line 88, in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
           ~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "<frozen importlib._bootstrap>", line 1387, in _gcd_import
  File "<frozen importlib._bootstrap>", line 1360, in _find_and_load
  File "<frozen importlib._bootstrap>", line 1331, in _find_and_load_unlocked
  File "<frozen importlib._bootstrap>", line 935, in _load_unlocked
  File "<frozen importlib._bootstrap_external>", line 1026, in exec_module
  File "<frozen importlib._bootstrap>", line 488, in _call_with_frames_removed
  File "C:\Users\W0024618\Desktop\IncidentDashboard\Backend\main.py", line 3, in <module>
    from incident_report import router as incident_router
  File "C:\Users\W0024618\Desktop\IncidentDashboard\Backend\incident_report.py", line 15, in <module>
    SERVER_TZ = zoneinfo.ZoneInfo("Asia/Kolkata")
  File "C:\Program Files\Python313\Lib\zoneinfo\_common.py", line 24, in load_tzdata
    raise ZoneInfoNotFoundError(f"No time zone found with key {key}")
zoneinfo._common.ZoneInfoNotFoundError: 'No time zone found with key Asia/Kolkata'

i dont want ot use asia kolkata time zone, becaue our componay office is over all world ok
and this from 
C:\Users\W0024618\Desktop\IncidentDashboard\Backend\incident_report.py

# incident_report.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, validator
from typing import Optional, List, Any
from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.dialects.sqlite import JSON as SQLITE_JSON  # maps to TEXT in SQLite
from datetime import datetime, date
import zoneinfo
import json



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


C:\Users\W0024618\Desktop\IncidentDashboard\Backend\main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from incident_report import router as incident_router

app = FastAPI(title="Incident Reporting API")

# CORS for frontend
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(incident_router)

@app.get("/")
def read_root():
    return {"message": "Incident Reporting Backend is running"}
