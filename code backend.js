Incident Reporting Form
When you submit this form, it will not automatically collect your details like name and email address unless you provide it yourself.
Required *
1.Type of Incident / Accident *
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
7.Incident reported to:  *
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
 Attach File uploads (images/pdf)
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
19.Preventive actions taken during or after incident/accident (If any):       
Attach File uploads (images/pdf)
                                                                Submit 

  Print (IN pdf) 
ok now create frntedn this fomr re create ok 
using // Regex  ok 
i want to creat on problar way ok
and first from disply only in 6 then yes or no other ok  ok 
C:\Users\W0024618\Desktop\IncidentDashboard\frontend\src\components\IncidentForm.jsx
import React, { useState, useEffect, useRef } from "react";
import "../assets/css/IncidentForm.css";

/**
 * IncidentForm
 * - Autosaves draft to localStorage (key: incident_draft)
 * - Validates required branching rules:
 *     when was_reported_verbally === true -> incident_reported_to must be non-empty array
 * - Submits JSON to POST /incident/create
 */

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

const blankDraft = {
    type_of_incident: "",
    other_type_text: "",
    date_of_report: "",
    time_of_report: "",
    impacted_name: "",
    impacted_employee_id: "",
    was_reported_verbally: null, // true/false
    incident_reported_to: [], // array of strings
    reported_to_details: "",
    location: "",
    reported_by_name: "",
    reported_by_employee_id: "",
    reported_by_contact: "",
    date_of_incident: "",
    time_of_incident: "",
    detailed_description: "",
    immediate_actions_taken: "",
    accompanying_person: [], // [{name, contact}]
    witnesses: [], // array of strings
    witness_contacts: [], // array of strings (parallel to witnesses)
    root_cause_analysis: "",
    preventive_actions: ""
};

export default function IncidentForm({ onSubmitted }) {
    const [form, setForm] = useState(blankDraft);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const autosaveTimer = useRef(null);

    // Restore draft on mount
    useEffect(() => {
        try {
            const raw = localStorage.getItem("incident_draft");
            if (raw) setForm(JSON.parse(raw));
        } catch (e) {
            console.warn("Failed to restore draft", e);
        }
    }, []);

    // autosave on change (debounced)
    useEffect(() => {
        clearTimeout(autosaveTimer.current);
        autosaveTimer.current = setTimeout(() => {
            localStorage.setItem("incident_draft", JSON.stringify(form));
            setSaving(false);
        }, 700);
        setSaving(true);
        return () => clearTimeout(autosaveTimer.current);
    }, [form]);

    // helpers
    const update = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const toggleReportedTo = (option) => {
        const arr = form.incident_reported_to || [];
        if (arr.includes(option)) {
            update(
                "incident_reported_to",
                arr.filter(x => x !== option)
            );
        } else {
            update("incident_reported_to", [...arr, option]);
        }
    };

    const addWitness = () => {
        update("witnesses", [...(form.witnesses || []), ""]);
        update("witness_contacts", [...(form.witness_contacts || []), ""]);
    };
    const removeWitness = (idx) => {
        const w = [...(form.witnesses || [])];
        const wc = [...(form.witness_contacts || [])];
        w.splice(idx, 1);
        wc.splice(idx, 1);
        update("witnesses", w);
        update("witness_contacts", wc);
    };
    const updateWitness = (idx, val) => {
        const w = [...(form.witnesses || [])];
        w[idx] = val;
        update("witnesses", w);
    };
    const updateWitnessContact = (idx, val) => {
        const wc = [...(form.witness_contacts || [])];
        wc[idx] = val;
        update("witness_contacts", wc);
    };

    const addAccompanying = () => {
        update("accompanying_person", [...(form.accompanying_person || []), { name: "", contact: "" }]);
    };
    const removeAccompanying = (idx) => {
        const a = [...(form.accompanying_person || [])];
        a.splice(idx, 1);
        update("accompanying_person", a);
    };
    const updateAccompanying = (idx, key, val) => {
        const a = [...(form.accompanying_person || [])];
        a[idx] = { ...(a[idx] || {}), [key]: val };
        update("accompanying_person", a);
    };

    const validate = () => {
        const errs = {};
        // minimal required checks
        if (!form.type_of_incident) errs.type_of_incident = "Type is required";
        if (form.type_of_incident === "Other" && !form.other_type_text) errs.other_type_text = "Please enter other type";
        if (!form.date_of_report) errs.date_of_report = "Date of report is required";
        if (form.was_reported_verbally === null) errs.was_reported_verbally = "Please select Yes or No";

        if (form.was_reported_verbally) {
            if (!form.incident_reported_to || form.incident_reported_to.length === 0) {
                errs.incident_reported_to = "Select at least one option for who it was reported to";
            }
        }

        // require reported_by fields for both branches
        if (!form.reported_by_name) errs.reported_by_name = "Reported by - Name is required";
        if (!form.reported_by_contact) errs.reported_by_contact = "Reported by - Contact is required";
        if (!form.date_of_incident) errs.date_of_incident = "Date of incident is required";
        if (!form.detailed_description) errs.detailed_description = "Description is required";

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const clearDraft = () => {
        localStorage.removeItem("incident_draft");
        setForm(blankDraft);
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e && e.preventDefault();
        if (!validate()) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        // prepare payload matching your backend pydantic model
        const payload = {
            type_of_incident: form.type_of_incident === "Other" ? form.other_type_text : form.type_of_incident,
            date_of_report: form.date_of_report || null,
            time_of_report: form.time_of_report || null,
            impacted_name: form.impacted_name || null,
            impacted_employee_id: form.impacted_employee_id || null,
            was_reported_verbally: !!form.was_reported_verbally,
            incident_reported_to: form.was_reported_verbably ? form.incident_reported_to : form.incident_reported_to,
            reported_to_details: form.reported_to_details || null,
            location: form.location || null,
            reported_by_name: form.reported_by_name || null,
            reported_by_employee_id: form.reported_by_employee_id || null,
            reported_by_contact: form.reported_by_contact || null,
            date_of_incident: form.date_of_incident || null,
            time_of_incident: form.time_of_incident || null,
            detailed_description: form.detailed_description || null,
            immediate_actions_taken: form.immediate_actions_taken || null,
            accompanying_person: form.accompanying_person && form.accompanying_person.length ? form.accompanying_person : null,
            witnesses: form.witnesses && form.witnesses.length ? form.witnesses : null,
            witness_contacts: form.witness_contacts && form.witness_contacts.length ? form.witness_contacts : null,
            root_cause_analysis: form.root_cause_analysis || null,
            preventive_actions: form.preventive_actions || null
        };

        try {
            const res = await fetch("http://localhost:8000/incident/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const json = await res.json();
            if (!res.ok) {
                throw new Error(json.detail || JSON.stringify(json));
            }
            alert("Incident submitted successfully");
            clearDraft();
            if (typeof onSubmitted === "function") onSubmitted(json);
        } catch (err) {
            console.error("Submit failed", err);
            alert("Submit failed: " + (err.message || err));
        }
    };

    return (
        <div className="incident-card">
            <h2>Incident Reporting Form</h2>
            <p className="muted">When you submit this form, it will not automatically collect your details like name and email address unless you provide it yourself.</p>

            <form onSubmit={handleSubmit} className="incident-form" noValidate>
                <label>1. Type of Incident / Accident *</label>
                <div className="row">
                    <select value={form.type_of_incident} onChange={e => update("type_of_incident", e.target.value)}>
                        <option value="">-- select type --</option>
                        {INCIDENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {errors.type_of_incident && <div className="error">{errors.type_of_incident}</div>}
                </div>

                {form.type_of_incident === "Other" && (
                    <div className="row">
                        <label>Other - Enter your answer *</label>
                        <input type="text" value={form.other_type_text} onChange={e => update("other_type_text", e.target.value)} />
                        {errors.other_type_text && <div className="error">{errors.other_type_text}</div>}
                    </div>
                )}

                <div className="row">
                    <label>2. Date of Report *</label>
                    <input type="date" value={form.date_of_report} onChange={e => update("date_of_report", e.target.value)} />
                    {errors.date_of_report && <div className="error">{errors.date_of_report}</div>}
                </div>

                <div className="row">
                    <label>3. Time of Report (HH:MM)</label>
                    <input type="time" value={form.time_of_report} onChange={e => update("time_of_report", e.target.value)} />
                </div>

                <div className="row">
                    <label>4. Name of Impacted Employee / Person</label>
                    <input value={form.impacted_name} onChange={e => update("impacted_name", e.target.value)} />
                </div>

                <div className="row">
                    <label>5. Employee ID of Impacted Employee</label>
                    <input value={form.impacted_employee_id} onChange={e => update("impacted_employee_id", e.target.value)} />
                </div>

                <div className="row">
                    <label>6. Was this incident reported verbally before submitting this report? *</label>
                    <div className="radio-row">
                        <label><input type="radio" checked={form.was_reported_verbally === true} onChange={() => update("was_reported_verbally", true)} /> Yes</label>
                        <label><input type="radio" checked={form.was_reported_verbually === false || form.was_reported_verbally === false} onChange={() => update("was_reported_verbally", false)} /> No</label>
                    </div>
                    {errors.was_reported_verbally && <div className="error">{errors.was_reported_verbally}</div>}
                    <div className="muted">** In case of medical emergency inform local HR</div>
                </div>

                {/* Branching: If Yes */}
                {form.was_reported_verbally === true && (
                    <>
                        <div className="row">
                            <label>7. Incident reported to: (select one or more) *</label>
                            <div className="checkbox-grid">
                                {REPORTED_TO_OPTIONS.map(opt => (
                                    <label key={opt}>
                                        <input type="checkbox"
                                            checked={(form.incident_reported_to || []).includes(opt)}
                                            onChange={() => toggleReportedTo(opt)} /> {opt}
                                    </label>
                                ))}
                            </div>
                            {errors.incident_reported_to && <div className="error">{errors.incident_reported_to}</div>}
                        </div>

                        <div className="row">
                            <label>8. If Yes, to whom (Name and Department):</label>
                            <input value={form.reported_to_details} onChange={e => update("reported_to_details", e.target.value)} />
                        </div>
                    </>
                )}

                {/* Common fields (both branches include location + reporter + incident details) */}
                <div className="row">
                    <label>9. Location of Incident or Accident (Specify Office / Branch)</label>
                    <input value={form.location} onChange={e => update("location", e.target.value)} />
                </div>

                <div className="row">
                    <label>10. Reported By - Name: *</label>
                    <input value={form.reported_by_name} onChange={e => update("reported_by_name", e.target.value)} />
                    {errors.reported_by_name && <div className="error">{errors.reported_by_name}</div>}
                </div>

                <div className="row">
                    <label>11. Reported By - Employee ID #</label>
                    <input value={form.reported_by_employee_id} onChange={e => update("reported_by_employee_id", e.target.value)} />
                </div>

                <div className="row">
                    <label>12. Reported By - Contact Number *</label>
                    <input value={form.reported_by_contact} onChange={e => update("reported_by_contact", e.target.value)} />
                    {errors.reported_by_contact && <div className="error">{errors.reported_by_contact}</div>}
                </div>

                <div className="row">
                    <label>13. Date of Incident Occurred *</label>
                    <input type="date" value={form.date_of_incident} onChange={e => update("date_of_incident", e.target.value)} />
                    {errors.date_of_incident && <div className="error">{errors.date_of_incident}</div>}
                </div>

                <div className="row">
                    <label>14. Time of Incident</label>
                    <input type="time" value={form.time_of_incident} onChange={e => update("time_of_incident", e.target.value)} />
                </div>

                <div className="row">
                    <label>15. Detailed Description of Incident *</label>
                    <textarea value={form.detailed_description} onChange={e => update("detailed_description", e.target.value)} rows={5} />
                    {errors.detailed_description && <div className="error">{errors.detailed_description}</div>}
                </div>

                <div className="row">
                    <label>16. Immediate Actions Taken</label>
                    <textarea value={form.immediate_actions_taken} onChange={e => update("immediate_actions_taken", e.target.value)} rows={3} />
                </div>

                <div className="row">
                    <label>17. Accompanying Person Name and Contact Details</label>
                    <div className="small-note">You can add multiple accompanying persons.</div>
                    {(form.accompanying_person || []).map((p, idx) => (
                        <div key={idx} className="accompany-row">
                            <input placeholder="Name" value={p.name || ""} onChange={e => updateAccompanying(idx, "name", e.target.value)} />
                            <input placeholder="Contact" value={p.contact || ""} onChange={e => updateAccompanying(idx, "contact", e.target.value)} />
                            <button type="button" className="btn small" onClick={() => removeAccompanying(idx)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" className="btn" onClick={addAccompanying}>Add Accompanying Person</button>
                </div>

                <div className="row">
                    <label>18/19. Name of Witnesses & Contact Numbers</label>
                    <div className="small-note">Add one witness per row.</div>
                    {(form.witnesses || []).map((w, idx) => (
                        <div key={idx} className="accompany-row">
                            <input placeholder="Witness Name" value={w || ""} onChange={e => updateWitness(idx, e.target.value)} />
                            <input placeholder="Contact" value={(form.witness_contacts || [])[idx] || ""} onChange={e => updateWitnessContact(idx, e.target.value)} />
                            <button type="button" className="btn small" onClick={() => removeWitness(idx)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" className="btn" onClick={addWitness}>Add Witness</button>
                </div>

                <div className="row">
                    <label>20. Root cause analysis of the incident/accident</label>
                    <textarea value={form.root_cause_analysis} onChange={e => update("root_cause_analysis", e.target.value)} rows={3} />
                </div>

                <div className="row">
                    <label>21. Preventive actions taken during or after incident/accident (If any)</label>
                    <textarea value={form.preventive_actions} onChange={e => update("preventive_actions", e.target.value)} rows={3} />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn primary">Submit</button>
                    <button type="button" className="btn outline" onClick={clearDraft}>Clear Draft</button>
                    <div className="muted">{saving ? "Saving draft..." : "Draft saved locally"}</div>
                </div>
            </form>
        </div>
    );
}


// Regex 

-------------------
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
