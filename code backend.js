7. Incident reported to:  this i want select box not check box ok 
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

  const update = (k, v) => {
    if (k === "was_reported_verbally") {
      setShowAfterSix(true); // 👈 When user answers Q6 → show rest
    }
    setForm(prev => ({ ...prev, [k]: v }));
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
  };
  const setAccompany = (i, key, val) => {
    const arr = [...(form.accompanying_person || [])];
    arr[i] = { ...(arr[i] || {}), [key]: val };
    update("accompanying_person", arr);
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
  };
  const setWitness = (i, val) => {
    const w = [...(form.witnesses || [])];
    w[i] = val;
    update("witnesses", w);
  };
  const setWitnessContact = (i, val) => {
    const wc = [...(form.witness_contacts || [])];
    wc[i] = val;
    update("witness_contacts", wc);
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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[+\d][\d\s\-().]{5,}$/;
  const empIdRegex = /^[A-Za-z0-9\-_.]{1,20}$/;

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
    else if (!phoneRegex.test(form.reported_by_contact)) e.reported_by_contact = "Invalid phone number.";
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
                  <div className="checkbox-grid">
                    {REPORTED_TO_OPTIONS.map(opt => (
                      <label key={opt}>
                        <input type="checkbox" checked={(form.incident_reported_to || []).includes(opt)} onChange={() => toggleReportedTo(opt)} /> {opt}
                      </label>
                    ))}
                  </div>
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
