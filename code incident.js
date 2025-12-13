read this code ony, 
and read each line for this code, 
wiht the help me this we are creae full project, 
and more 
backend code----
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

    was_reported_verbally = Column(Integer, default=0)    # 1 = True, 0 = False
    incident_reported_to = Column(String, nullable=True) # JSON-string list when present
    reported_to_details = Column(String, nullable=True)

    location = Column(String, nullable=False)

    reported_by_name = Column(String, nullable=False)
    reported_by_employee_id = Column(String, nullable=False)
    reported_by_email = Column(String, nullable=False)
    reported_by_contact = Column(String, nullable=False)

    date_of_incident = Column(String, nullable=False)
    time_of_incident = Column(String, nullable=False)

    detailed_description = Column(Text, nullable=False)
    immediate_actions_taken = Column(Text, nullable=False)

    accompanying_person = Column(SQLITE_JSON, nullable=True)   # list of {name, contact}
    witnesses = Column(SQLITE_JSON, nullable=True)            # list of strings
    witness_contacts = Column(SQLITE_JSON, nullable=True)     # list of strings

    root_cause_analysis = Column(Text, nullable=True)         # optional
    preventive_actions = Column(Text, nullable=True)          # optional

    proofs = Column(SQLITE_JSON, nullable=True)               # list of uploaded filenames

    created_at = Column(DateTime, default=datetime.utcnow)

# create table(s)
Base.metadata.create_all(bind=engine)

# -------------------------
# Pydantic Schemas (strict types)
# -------------------------
class AccompanyPerson(BaseModel):
    name: str = Field(..., min_length=1)
    contact: str = Field(..., min_length=3)

class IncidentCreate(BaseModel):
    # required
    type_of_incident: str = Field(..., min_length=1)
    other_type_text: Optional[str] = None

    date_of_report: date
    time_of_report: time

    impacted_name: str = Field(..., min_length=1)
    impacted_employee_id: str = Field(..., min_length=1)

    was_reported_verbally: bool

    # If was_reported_verbally true
    incident_reported_to: Optional[List[str]] = None
    reported_to_details: Optional[str] = None

    location: str = Field(..., min_length=1)

    reported_by_name: str = Field(..., min_length=1)
    reported_by_employee_id: str = Field(..., min_length=1)
    reported_by_email: EmailStr
    reported_by_contact: str = Field(..., min_length=3)

    date_of_incident: date
    time_of_incident: time

    detailed_description: str = Field(..., min_length=5)
    immediate_actions_taken: str = Field(..., min_length=1)

    accompanying_person: List[AccompanyPerson] = Field(..., min_items=0)
    witnesses: List[str] = Field(..., min_items=0)
    witness_contacts: List[str] = Field(..., min_items=0)

    root_cause_analysis: Optional[str] = None
    preventive_actions: Optional[str] = None

    # proofs are handled via multipart upload; not present here

    @validator("other_type_text", always=True)
    def require_other_text_if_other(cls, v, values):
        if values.get("type_of_incident") and values.get("type_of_incident").strip().lower() == "other":
            if not v or not v.strip():
                raise ValueError("When type_of_incident is 'Other', provide other_type_text.")
            return v
        return v

    @validator("incident_reported_to", always=True)
    def validate_reported_to_if_needed(cls, v, values):
        if values.get("was_reported_verbally"):
            if not v or len(v) == 0:
                raise ValueError("When was_reported_verbally is True, provide incident_reported_to (list).")
        return v

    @validator("reported_to_details", always=True)
    def validate_reported_to_details_if_needed(cls, v, values):
        if values.get("was_reported_verbally"):
            if v is None or not str(v).strip():
                # require details when verbally reported (per your spec)
                raise ValueError("When was_reported_verbally is True, provide reported_to_details (Name and Department).")
        return v

    @validator("witness_contacts", always=True)
    def validate_witness_lengths(cls, v, values):
        w = values.get("witnesses") or []
        if len(w) != len(v):
            raise ValueError("witnesses and witness_contacts must have the same length (parallel arrays).")
        return v

class IncidentOut(BaseModel):
    id: int
    type_of_incident: str
    other_type_text: Optional[str] = None
    date_of_report: str
    time_of_report: str
    impacted_name: str
    impacted_employee_id: str
    was_reported_verbally: bool
    incident_reported_to: Optional[List[str]] = None
    reported_to_details: Optional[str] = None
    location: str
    reported_by_name: str
    reported_by_employee_id: str
    reported_by_email: str
    reported_by_contact: str
    date_of_incident: str
    time_of_incident: str
    detailed_description: str
    immediate_actions_taken: str
    accompanying_person: Optional[List[dict]] = None
    witnesses: Optional[List[str]] = None
    witness_contacts: Optional[List[str]] = None
    root_cause_analysis: Optional[str] = None
    preventive_actions: Optional[str] = None
    proofs: Optional[List[str]] = None
    created_at: datetime

    class Config:
        orm_mode = True

# -------------------------
# Helpers
# -------------------------
def save_uploads(upload_files: Optional[List[UploadFile]]) -> List[str]:
    """Save uploaded files to UPLOAD_DIR and return list of filenames (relative)."""
    if not upload_files:
        return []
    saved = []
    for f in upload_files:
        # sanitize and create unique filename
        ts = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
        name = f.filename or "upload"
        # simple sanitization
        name = "".join(c for c in name if c.isalnum() or c in (" ", ".", "_", "-")).strip()
        filename = f"{ts}_{name}"
        path = os.path.join(UPLOAD_DIR, filename)
        # write file
        with open(path, "wb") as fh:
            fh.write(f.file.read())
        saved.append(filename)
    return saved

# -------------------------
# Endpoints
# -------------------------
@router.post("/create", response_model=IncidentOut)
async def create_incident(
    payload: str = Form(...),            # JSON string of all fields (see IncidentCreate)
    proofs: Optional[List[UploadFile]] = File(None)
):
    """
    Accepts multipart/form-data:
      - payload: JSON string matching IncidentCreate schema
      - proofs: optional list of files (images, pdf)
    """
    # parse JSON payload
    try:
        data = json.loads(payload)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON payload: {e}")

    # validate payload with Pydantic
    try:
        incident = IncidentCreate.parse_obj(data)
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

    db = SessionLocal()
    try:
        saved_files = save_uploads(proofs)

        inst = IncidentReport(
            type_of_incident = incident.type_of_incident.strip(),
            other_type_text = incident.other_type_text.strip() if incident.other_type_text else None,
            date_of_report = incident.date_of_report.isoformat(),
            time_of_report = incident.time_of_report.strftime("%H:%M:%S"),
            impacted_name = incident.impacted_name.strip(),
            impacted_employee_id = incident.impacted_employee_id.strip(),
            was_reported_verbally = 1 if incident.was_reported_verbally else 0,
            incident_reported_to = json.dumps(incident.incident_reported_to) if incident.incident_reported_to else None,
            reported_to_details = incident.reported_to_details.strip() if incident.reported_to_details else None,
            location = incident.location.strip(),
            reported_by_name = incident.reported_by_name.strip(),
            reported_by_employee_id = incident.reported_by_employee_id.strip(),
            reported_by_email = str(incident.reported_by_email),
            reported_by_contact = incident.reported_by_contact.strip(),
            date_of_incident = incident.date_of_incident.isoformat(),
            time_of_incident = incident.time_of_incident.strftime("%H:%M:%S"),
            detailed_description = incident.detailed_description.strip(),
            immediate_actions_taken = incident.immediate_actions_taken.strip(),
            accompanying_person = [p.dict() for p in incident.accompanying_person] if incident.accompanying_person else None,
            witnesses = incident.witnesses if incident.witnesses else None,
            witness_contacts = incident.witness_contacts if incident.witness_contacts else None,
            root_cause_analysis = incident.root_cause_analysis.strip() if incident.root_cause_analysis else None,
            preventive_actions = incident.preventive_actions.strip() if incident.preventive_actions else None,
            proofs = saved_files if saved_files else None,
            created_at = datetime.utcnow()
        )

        db.add(inst)
        db.commit()
        db.refresh(inst)

        # convert incident_reported_to JSON-string back to list for response
        if inst.incident_reported_to:
            try:
                inst.incident_reported_to = json.loads(inst.incident_reported_to)
            except:
                inst.incident_reported_to = None

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
        # parse JSON strings
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
==========================
frontend code ----

// C:\Users\W0024618\Desktop\IncidentDashboard\frontend\src\components\IncidentForm.jsx
import React, { useEffect, useRef, useState } from "react";
import "../assets/css/IncidentForm.css";

const INCIDENT_TYPES = [
  "Medical",
  "Theft",
  "Fire",
  "HR Related Incident",
  "Outside Work Place Violence",
  "Threat",
  "Death",
  "Fraud",
  "Any Other Safety / Security Related Incident",
  "Other"
];

const REPORTED_TO_OPTIONS = [
  "Supervisor",
  "Manager",
  "HR",
  "Other Employee",
  "Not Reported"
];

const emptyForm = {
  type_of_incident: "",
  other_type_text: "",
  date_of_report: "",
  time_of_report: "",
  impacted_name: "",
  impacted_employee_id: "",
  was_reported_verbally: null,
  incident_reported_to: [],
  reported_to_details: "",
  location: "",
  reported_by_name: "",
  reported_by_employee_id: "",
  reported_by_email: "",
  reported_by_contact: "",
  date_of_incident: "",
  time_of_incident: "",
  detailed_description: "",
  immediate_actions_taken: "",
  accompanying_person: [],
  witnesses: [],
  witness_contacts: [],
  root_cause_analysis: "",
  preventive_actions: ""
};

export default function IncidentForm({ onSubmitted }) {
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const autosaveRef = useRef(null);

  // 👇 NEW: Show only 1–6 initially
  const [showAfterSix, setShowAfterSix] = useState(false);

  // NEW: touched fields (to avoid showing required errors before user interacts)
  const [touched, setTouched] = useState({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("incident_draft");
      if (raw) setForm(prev => ({ ...prev, ...JSON.parse(raw) }));
    } catch (e) {
      console.warn("Restore draft failed", e);
    }
  }, []);

  useEffect(() => {
    clearTimeout(autosaveRef.current);
    setSaving(true);
    autosaveRef.current = setTimeout(() => {
      try {
        localStorage.setItem("incident_draft", JSON.stringify(form));
      } catch (e) {
        console.warn("Autosave failed", e);
      }
      setSaving(false);
    }, 700);

    return () => clearTimeout(autosaveRef.current);
  }, [form]);

  // regexes used by both live validation and final validate()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const empIdRegex = /^[A-Za-z0-9\-_.]{1,20}$/;

  /**
   * PHONE UTILITIES
   * - only allow a single leading '+' (optional) and digits
   * - enforce E.164 acceptable range: 7..15 digits total (this is global-friendly)
  */

  const sanitizePhoneInput = (val) => {
    if (!val && val !== "") return val;
    // remove everything except digits and plus
    let v = String(val).replace(/[^\d+]/g, "");
    // allow + only at start, and only one
    v = v.replace(/\++/g, "+");
    if (v.indexOf("+") > 0) {
      // move any '+' not at start to start only if existed
      v = "+" + v.replace(/\+/g, "");
    }
    // if multiple plus signs, keep single leading +
    if (v.startsWith("+")) {
      v = "+" + v.slice(1).replace(/\+/g, "");
    } else {
      v = v.replace(/\+/g, "");
    }
    return v;
  };

  const countPhoneDigits = (val) => {
    if (!val) return 0;
    return (String(val).replace(/\D/g, "") || "").length;
  };

  const isValidPhoneLive = (val) => {
    if (!val) return false;
    const digits = countPhoneDigits(val);
    // E.164: maximum 15 digits; set minimum to 7 (common smallest usable numbers)
    return digits >= 7 && digits <= 15;
  };

  // validate single field live and update errors state accordingly
  const validateField = (key, value, extra = {}) => {
    // extra can include index for witness/accompany or other context
    setErrors(prev => {
      const next = { ...prev };

      const setErr = (k, msg) => (next[k] = msg);
      const clearErr = (k) => { if (next[k]) delete next[k]; };

      switch (key) {
        case "type_of_incident":
          if (!value && touched.type_of_incident) setErr("type_of_incident", "Type is required.");
          else clearErr("type_of_incident");
          break;
        case "other_type_text":
          if (form.type_of_incident === "Other" && (!value || !value.trim()) && touched.other_type_text)
            setErr("other_type_text", "Please enter the incident type.");
          else clearErr("other_type_text");
          break;
        case "date_of_report":
          if (!value && touched.date_of_report) setErr("date_of_report", "Date of report required.");
          else clearErr("date_of_report");
          break;
        case "time_of_report":
          if (!value && touched.time_of_report) setErr("time_of_report", "Time of report required.");
          else clearErr("time_of_report");
          break;
        case "impacted_name":
          if (!value && touched.impacted_name) setErr("impacted_name", "Impacted name is required.");
          else clearErr("impacted_name");
          break;
        case "impacted_employee_id":
          if (!value && touched.impacted_employee_id) setErr("impacted_employee_id", "Impacted employee ID is required.");
          else if (value && !empIdRegex.test(value)) setErr("impacted_employee_id", "Invalid employee ID.");
          else clearErr("impacted_employee_id");
          break;
        case "was_reported_verbally":
          if (value === null && touched.was_reported_verbally) setErr("was_reported_verbally", "Please select Yes or No.");
          else clearErr("was_reported_verbally");
          break;
        case "incident_reported_to":
          if (form.was_reported_verbally === true && (!value || !value.length) && touched.incident_reported_to)
            setErr("incident_reported_to", "Select at least one option.");
          else clearErr("incident_reported_to");
          break;
        case "reported_to_details":
          if (form.was_reported_verbally === true && (!value || !value.trim()) && touched.reported_to_details)
            setErr("reported_to_details", "Provide name & department.");
          else clearErr("reported_to_details");
          break;
        case "location":
          if ((!value || !String(value).trim()) && touched.location) setErr("location", "Location is required.");
          else clearErr("location");
          break;
        case "reported_by_name":
          if (!value && touched.reported_by_name) setErr("reported_by_name", "Reporter name required.");
          else clearErr("reported_by_name");
          break;
        case "reported_by_employee_id":
          if (!value && touched.reported_by_employee_id) setErr("reported_by_employee_id", "Reporter employee ID required.");
          else if (value && !empIdRegex.test(value)) setErr("reported_by_employee_id", "Invalid employee ID.");
          else clearErr("reported_by_employee_id");
          break;
        case "reported_by_email":
          if (!value && touched.reported_by_email) setErr("reported_by_email", "Reporter email required.");
          else if (value && !emailRegex.test(value)) setErr("reported_by_email", "Invalid email address.");
          else clearErr("reported_by_email");
          break;
        case "reported_by_contact":
          if (!value && touched.reported_by_contact) setErr("reported_by_contact", "Reporter contact required.");
          else if (value && !isValidPhoneLive(value)) setErr("reported_by_contact", "Invalid phone number — must be 7 to 15 digits (can include leading +).");
          else clearErr("reported_by_contact");
          break;
        case "date_of_incident":
          if (!value && touched.date_of_incident) setErr("date_of_incident", "Date of incident required.");
          else clearErr("date_of_incident");
          break;
        case "time_of_incident":
          if (!value && touched.time_of_incident) setErr("time_of_incident", "Time of incident required.");
          else clearErr("time_of_incident");
          break;
        case "detailed_description":
          if ((!value || !String(value).trim() || String(value).length < 5) && touched.detailed_description)
            setErr("detailed_description", "Please provide a detailed description (min 5 chars).");
          else clearErr("detailed_description");
          break;
        case "immediate_actions_taken":
          if ((!value || !String(value).trim()) && touched.immediate_actions_taken)
            setErr("immediate_actions_taken", "Immediate actions are required.");
          else clearErr("immediate_actions_taken");
          break;
        default:
          break;
      }

      // witness / accompanying contact validation by index if provided
      if (extra.type === "witness_contact") {
        const idx = extra.index;
        const keyName = `witness_contacts_${idx}`;
        if (!value && touched[`witness_contacts_${idx}`]) {
          next[keyName] = "Contact required for this witness.";
        } else if (value && !isValidPhoneLive(value)) {
          next[keyName] = "Invalid phone number — must be 7 to 15 digits (can include leading +).";
        } else {
          if (next[keyName]) delete next[keyName];
        }
      }

      if (extra.type === "accompany_contact") {
        const idx = extra.index;
        const keyName = `accompanying_person_contact_${idx}`;
        if (!value && touched[keyName]) {
          next[keyName] = "Contact required for this person.";
        } else if (value && !isValidPhoneLive(value)) {
          next[keyName] = "Invalid phone number — must be 7 to 15 digits (can include leading +).";
        } else {
          if (next[keyName]) delete next[keyName];
        }
      }

      // cleanup: if witness count mismatch error existed but counts fixed, remove it
      if ((form.witnesses || []).length === (form.witness_contacts || []).length) {
        if (next.witness_contacts) delete next.witness_contacts;
      }

      return next;
    });
  };

  const update = (k, v) => {
    // mark touched
    setTouched(prev => ({ ...prev, [k]: true }));

    // Special handling for phone-like fields: sanitize input
    if (k === "reported_by_contact") {
      v = sanitizePhoneInput(v);
    }

    // Update state
    setForm(prev => ({ ...prev, [k]: v }));

    // Run live validation for this field
    validateField(k, v);

    // For fields that depend on others, also validate dependent fields:
    if (k === "type_of_incident") validateField("other_type_text", form.other_type_text);
    if (k === "was_reported_verbally") {
      setShowAfterSix(true); // 👈 When user answers Q6 → show rest
      validateField("incident_reported_to", form.incident_reported_to);
      validateField("reported_to_details", form.reported_to_details);
    }
  };

  const toggleReportedTo = (opt) => {
    const arr = [...(form.incident_reported_to || [])];
    const idx = arr.indexOf(opt);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(opt);
    update("incident_reported_to", arr);
  };

  const addAccompany = () => update("accompanying_person", [...(form.accompanying_person || []), { name: "", contact: "" }]);
  const removeAccompany = (i) => {
    const arr = [...(form.accompanying_person || [])];
    arr.splice(i, 1);
    update("accompanying_person", arr);
    // clear any contact error for this index
    setErrors(prev => {
      const next = { ...prev };
      const keyName = `accompanying_person_contact_${i}`;
      if (next[keyName]) delete next[keyName];
      return next;
    });
  };
  const setAccompany = (i, key, val) => {
    const arr = [...(form.accompanying_person || [])];
    arr[i] = { ...(arr[i] || {}), [key]: val };
    update("accompanying_person", arr);

    // If this is the contact field, sanitize and validate
    if (key === "contact") {
      const sanitized = sanitizePhoneInput(val);
      // update the specific value immediately in form (avoid double-touch race by directly setting)
      setForm(prev => {
        const next = { ...prev };
        const copy = [...(next.accompanying_person || [])];
        copy[i] = { ...(copy[i] || {}), contact: sanitized };
        next.accompanying_person = copy;
        return next;
      });
      setTouched(prev => ({ ...prev, [`accompanying_person_contact_${i}`]: true }));
      validateField("accompanying_person", sanitized, { type: "accompany_contact", index: i });
    } else {
      // if non-contact field changed, no special validation (name maybe)
    }
  };

  const addWitness = () => {
    update("witnesses", [...(form.witnesses || []), ""]);
    update("witness_contacts", [...(form.witness_contacts || []), ""]);
  };
  const removeWitness = (i) => {
    const w = [...(form.witnesses || [])];
    const wc = [...(form.witness_contacts || [])];
    w.splice(i, 1);
    wc.splice(i, 1);
    update("witnesses", w);
    update("witness_contacts", wc);

    // clear any per-index errors
    setErrors(prev => {
      const next = { ...prev };
      const keyName = `witness_contacts_${i}`;
      if (next[keyName]) delete next[keyName];
      return next;
    });
  };
  const setWitness = (i, val) => {
    const w = [...(form.witnesses || [])];
    w[i] = val;
    update("witnesses", w);
  };
  const setWitnessContact = (i, val) => {
    // sanitize input
    const sanitized = sanitizePhoneInput(val);

    const wc = [...(form.witness_contacts || [])];
    wc[i] = sanitized;
    update("witness_contacts", wc);

    // mark touched for this witness contact and validate
    setTouched(prev => ({ ...prev, [`witness_contacts_${i}`]: true }));
    validateField("witness_contacts", sanitized, { type: "witness_contact", index: i });
  };

  const onFilesSelected = (evt) => {
    const selected = Array.from(evt.target.files || []);
    setFiles(prev => [...prev, ...selected]);
    evt.target.value = "";
  };
  const removeFile = (i) => setFiles(prev => {
    const a = [...prev];
    a.splice(i, 1);
    return a;
  });

/**
 * 
 * @returns 
 * 
 */

  const validate = () => {
    const e = {};

    if (form.was_reported_verbally === null)
      e.was_reported_verbally = "Please select Yes or No.";

    if (!form.type_of_incident) e.type_of_incident = "Type is required.";
    if (form.type_of_incident === "Other" && !form.other_type_text) e.other_type_text = "Please enter the incident type.";
    if (!form.date_of_report) e.date_of_report = "Date of report required.";
    if (!form.time_of_report) e.time_of_report = "Time of report required.";
    if (!form.impacted_name) e.impacted_name = "Impacted name is required.";
    if (!form.impacted_employee_id) e.impacted_employee_id = "Impacted employee ID is required.";
    else if (!empIdRegex.test(form.impacted_employee_id)) e.impacted_employee_id = "Invalid employee ID.";

    if (form.was_reported_verbally === true) {
      if (!form.incident_reported_to?.length)
        e.incident_reported_to = "Select at least one option.";
      if (!form.reported_to_details?.trim())
        e.reported_to_details = "Provide name & department.";
    }

    if (!form.location?.trim()) e.location = "Location is required.";
    if (!form.reported_by_name) e.reported_by_name = "Reporter name required.";
    if (!form.reported_by_employee_id) e.reported_by_employee_id = "Reporter employee ID required.";
    else if (!empIdRegex.test(form.reported_by_employee_id)) e.reported_by_employee_id = "Invalid employee ID.";
    if (!form.reported_by_email) e.reported_by_email = "Reporter email required.";
    else if (!emailRegex.test(form.reported_by_email)) e.reported_by_email = "Invalid email address.";
    if (!form.reported_by_contact) e.reported_by_contact = "Reporter contact required.";
    else if (!/^[+\d][\d\s\-().]{5,}$/.test(form.reported_by_contact)) e.reported_by_contact = "Invalid phone number.";
    if (!form.date_of_incident) e.date_of_incident = "Date of incident required.";
    if (!form.time_of_incident) e.time_of_incident = "Time of incident required.";
    if (!form.detailed_description?.trim() || form.detailed_description.length < 5) e.detailed_description = "Please provide a detailed description (min 5 chars).";
    if (!form.immediate_actions_taken?.trim()) e.immediate_actions_taken = "Immediate actions are required.";

    if ((form.witnesses || []).length !== (form.witness_contacts || []).length)
      e.witness_contacts = "Add contact for each witness.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const padSeconds = (t) => {
      if (!t) return null;
      if (t.length === 5) return `${t}:00`;
      return t;
    };

    const payloadObj = {
      type_of_incident: form.type_of_incident,
      other_type_text: form.type_of_incident === "Other" ? form.other_type_text : null,
      date_of_report: form.date_of_report,
      time_of_report: padSeconds(form.time_of_report),
      impacted_name: form.impacted_name,
      impacted_employee_id: form.impacted_employee_id,
      was_reported_verbally: !!form.was_reported_verbally,
      incident_reported_to: form.incident_reported_to?.length ? form.incident_reported_to : null,
      reported_to_details: form.reported_to_details || null,
      location: form.location,
      reported_by_name: form.reported_by_name,
      reported_by_employee_id: form.reported_by_employee_id,
      reported_by_email: form.reported_by_email,
      reported_by_contact: form.reported_by_contact,
      date_of_incident: form.date_of_incident,
      time_of_incident: padSeconds(form.time_of_incident),
      detailed_description: form.detailed_description,
      immediate_actions_taken: form.immediate_actions_taken,
      accompanying_person: form.accompanying_person?.length ? form.accompanying_person : [],
      witnesses: form.witnesses?.length ? form.witnesses : [],
      witness_contacts: form.witness_contacts?.length ? form.witness_contacts : [],
      root_cause_analysis: form.root_cause_analysis || null,
      preventive_actions: form.preventive_actions || null
    };

    try {
      const fd = new FormData();
      fd.append("payload", JSON.stringify(payloadObj));
      files.forEach(f => fd.append("proofs", f));

      const res = await fetch("http://localhost:8000/incident/create", {
        method: "POST",
        body: fd
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || JSON.stringify(data));

      alert("Incident submitted successfully (ID: " + data.id + ")");
      localStorage.removeItem("incident_draft");
      setForm(emptyForm);
      setFiles([]);
      setErrors({});
      setTouched({});
      if (typeof onSubmitted === "function") onSubmitted(data);
    } catch (err) {
      console.error("Submit error", err);
      alert("Submit failed: " + (err.message || err));
    }
  };

  const clearDraft = () => {
    localStorage.removeItem("incident_draft");
    setForm(emptyForm);
    setFiles([]);
    setErrors({});
    setTouched({});
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="incident-card">
      <div className="incident-header">
        <h2>Incident Reporting Form</h2>
        <div className="muted">When you submit this form, it will not automatically collect your details like name and email address unless you provide it yourself.</div>
      </div>

      <form className="incident-form" onSubmit={handleSubmit} noValidate>

        {/* -------------------------
             ALWAYS SHOW Q1–Q6
        -------------------------- */}

        <div className="row">
          <label>1. Type of Incident / Accident <span className="required">*</span></label>
          <select value={form.type_of_incident} onChange={e => update("type_of_incident", e.target.value)}>
            <option value="">-- select type --</option>
            {INCIDENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {form.type_of_incident === "Other" && (
            <>
              <input className="mt8" placeholder="Please enter the incident type" value={form.other_type_text} onChange={e => update("other_type_text", e.target.value)} />
              {errors.other_type_text && <div className="error">{errors.other_type_text}</div>}
            </>
          )}
          {errors.type_of_incident && <div className="error">{errors.type_of_incident}</div>}
        </div>

        <div className="row row-grid-2">
          <div>
            <label>2. Date of Report <span className="required">*</span></label>
            <input type="date" value={form.date_of_report} onChange={e => update("date_of_report", e.target.value)} />
            {errors.date_of_report && <div className="error">{errors.date_of_report}</div>}
          </div>
          <div>
            <label>3. Time of Report (HH:MM) <span className="required">*</span></label>
            <input type="time" value={form.time_of_report} onChange={e => update("time_of_report", e.target.value)} />
            {errors.time_of_report && <div className="error">{errors.time_of_report}</div>}
          </div>
        </div>

        <div className="row row-grid-2">
          <div>
            <label>4. Name of Impacted Employee / Person <span className="required">*</span></label>
            <input value={form.impacted_name} onChange={e => update("impacted_name", e.target.value)} />
            {errors.impacted_name && <div className="error">{errors.impacted_name}</div>}
          </div>
          <div>
            <label>5. Employee ID of Impacted Employee <span className="required">*</span></label>
            <input value={form.impacted_employee_id} onChange={e => update("impacted_employee_id", e.target.value)} />
            {errors.impacted_employee_id && <div className="error">{errors.impacted_employee_id}</div>}
          </div>
        </div>

        <div className="row">
          <label>6. Was this incident reported verbally before submitting this report? <span className="required">*</span></label>
          <div className="radio-row">
            <label><input type="radio" name="reported" checked={form.was_reported_verbally === true} onChange={() => update("was_reported_verbally", true)} /> Yes</label>
            <label><input type="radio" name="reported" checked={form.was_reported_verbally === false} onChange={() => update("was_reported_verbally", false)} /> No</label>
          </div>
          {errors.was_reported_verbally && <div className="error">{errors.was_reported_verbally}</div>}
          <div className="muted">** In case of medical emergency inform local HR</div>
        </div>

        {/* -------------------------
           SHOW REST ONLY AFTER Q6
        -------------------------- */}
        {showAfterSix && (
          <>
            {form.was_reported_verbally === true && (
              <>
                <div className="row">
                  <label>7. Incident reported to: <span className="required">*</span></label>
                  <select
                    value={form.incident_reported_to[0] || ""} // only single selection
                    onChange={e => update("incident_reported_to", [e.target.value])}
                  >
                    <option value="">-- select --</option>
                    {REPORTED_TO_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {errors.incident_reported_to && <div className="error">{errors.incident_reported_to}</div>}
                </div>

                <div className="row">
                  <label>8. If Yes, to whom (Name and Department): <span className="required">*</span></label>
                  <input value={form.reported_to_details} onChange={e => update("reported_to_details", e.target.value)} />
                  {errors.reported_to_details && <div className="error">{errors.reported_to_details}</div>}
                </div>
              </>
            )}

            {/* Q9–Q21 appear normally */}
            <div className="row">
              <label>9. Location of Incident or Accident (Specify Office / Branch) <span className="required">*</span></label>
              <input value={form.location} onChange={e => update("location", e.target.value)} />
              {errors.location && <div className="error">{errors.location}</div>}
            </div>

            {/* (No changes below this point – your original code continues) */}
            {/* ------------------------------ */}
            {/* REST OF YOUR FORM UNCHANGED   */}
            {/* ------------------------------ */}

            <div className="row row-grid-3">
              <div>
                <label>10. Reported By - Name <span className="required">*</span></label>
                <input value={form.reported_by_name} onChange={e => update("reported_by_name", e.target.value)} />
                {errors.reported_by_name && <div className="error">{errors.reported_by_name}</div>}
              </div>
              <div>
                <label>11. Reported By - Employee ID <span className="required">*</span></label>
                <input value={form.reported_by_employee_id} onChange={e => update("reported_by_employee_id", e.target.value)} />
                {errors.reported_by_employee_id && <div className="error">{errors.reported_by_employee_id}</div>}
              </div>
              <div>
                <label>12. Reported By - Email <span className="required">*</span></label>
                <input value={form.reported_by_email} onChange={e => update("reported_by_email", e.target.value)} />
                {errors.reported_by_email && <div className="error">{errors.reported_by_email}</div>}
              </div>
            </div>

            <div className="row">
              <label>12b. Reported By - Contact Number <span className="required">*</span></label>
              <input value={form.reported_by_contact} onChange={e => update("reported_by_contact", e.target.value)} />
              {errors.reported_by_contact && <div className="error">{errors.reported_by_contact}</div>}
            </div>

            <div className="row row-grid-2">
              <div>
                <label>13. Date of Incident Occurred <span className="required">*</span></label>
                <input type="date" value={form.date_of_incident} onChange={e => update("date_of_incident", e.target.value)} />
                {errors.date_of_incident && <div className="error">{errors.date_of_incident}</div>}
              </div>
              <div>
                <label>14. Time of Incident <span className="required">*</span></label>
                <input type="time" value={form.time_of_incident} onChange={e => update("time_of_incident", e.target.value)} />
                {errors.time_of_incident && <div className="error">{errors.time_of_incident}</div>}
              </div>
            </div>

            <div className="row">
              <label>15. Detailed Description of Incident <span className="required">*</span></label>
              <textarea value={form.detailed_description} onChange={e => update("detailed_description", e.target.value)} rows={5} />
              {errors.detailed_description && <div className="error">{errors.detailed_description}</div>}
            </div>

            <div className="row">
              <label>16. Immediate Actions Taken <span className="required">*</span></label>
              <textarea value={form.immediate_actions_taken} onChange={e => update("immediate_actions_taken", e.target.value)} rows={3} />
              {errors.immediate_actions_taken && <div className="error">{errors.immediate_actions_taken}</div>}
            </div>

            <div className="row">
              <label>17. Accompanying Person Name and Contact Details</label>
              {(form.accompanying_person || []).map((p, i) => (
                <div key={i} className="accompany-row">
                  <input placeholder="Name" value={p.name} onChange={e => setAccompany(i, "name", e.target.value)} />
                  <input placeholder="Contact" value={p.contact} onChange={e => setAccompany(i, "contact", e.target.value)} />
                  {errors[`accompanying_person_contact_${i}`] && <div className="error">{errors[`accompanying_person_contact_${i}`]}</div>}
                  <button type="button" className="btn small" onClick={() => removeAccompany(i)}>Remove</button>
                </div>
              ))}
              <button type="button" className="btn" onClick={addAccompany}>Add Accompanying Person</button>
            </div>

            <div className="row">
              <label>18. Name of Witnesses / 19. Contact Number</label>
              {(form.witnesses || []).map((w, i) => (
                <div key={i} className="accompany-row">
                  <input placeholder="Witness Name" value={w} onChange={e => setWitness(i, e.target.value)} />
                  <input placeholder="Contact" value={(form.witness_contacts || [])[i] || ""} onChange={e => setWitnessContact(i, e.target.value)} />
                  {errors[`witness_contacts_${i}`] && <div className="error">{errors[`witness_contacts_${i}`]}</div>}
                  <button type="button" className="btn small" onClick={() => removeWitness(i)}>Remove</button>
                </div>
              ))}
              <button type="button" className="btn" onClick={addWitness}>Add Witness</button>
              {errors.witness_contacts && <div className="error">{errors.witness_contacts}</div>}
            </div>

            <div className="row">
              <label>20. Root cause analysis of the incident/accident</label>
              <textarea value={form.root_cause_analysis} onChange={e => update("root_cause_analysis", e.target.value)} rows={3} />
            </div>

            <div className="row">
              <label>21. Preventive actions taken during or after incident/accident (If any)</label>
              <textarea value={form.preventive_actions} onChange={e => update("preventive_actions", e.target.value)} rows={3} />
            </div>

            <div className="row">
              <label>Attach files (images / pdf) — optional</label>
              <input type="file" multiple onChange={onFilesSelected} />
              <div className="file-list">
                {files.map((f, i) => (
                  <div key={i} className="file-item">
                    <span>{f.name} ({Math.round(f.size / 1024)} KB)</span>
                    <button type="button" className="btn small" onClick={() => removeFile(i)}>Remove</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn primary">Submit</button>
              <button type="button" className="btn outline" onClick={clearDraft}>Clear Draft</button>
              <button type="button" className="btn" onClick={handlePrint}>Print (PDF)</button>
              <div className="muted">{saving ? "Saving draft..." : "Draft saved locally"}</div>
            </div>

          </>
        )}

      </form>
    </div>
  );
              }
