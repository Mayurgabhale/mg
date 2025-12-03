import React, { useEffect, useRef, useState } from "react";
import "../assets/css/IncidentForm.css";

// ----------------------------------------
// CONSTANTS
// ----------------------------------------
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

// ----------------------------------------
// EMPTY FORM TEMPLATE
// ----------------------------------------
const emptyForm = {
  type_of_incident: "",
  other_type_text: "",
  date_of_report: "",
  time_of_report: "",
  impacted_name: "",
  impacted_employee_id: "",
  was_reported_verbally: null, // yes/no later
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

// ----------------------------------------
// COMPONENT
// ----------------------------------------
export default function IncidentForm({ onSubmitted }) {
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const autosaveRef = useRef(null);

  // Restore draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem("incident_draft");
      if (raw) setForm(prev => ({ ...prev, ...JSON.parse(raw) }));
    } catch (e) { }
  }, []);

  // Autosave
  useEffect(() => {
    clearTimeout(autosaveRef.current);
    setSaving(true);
    autosaveRef.current = setTimeout(() => {
      localStorage.setItem("incident_draft", JSON.stringify(form));
      setSaving(false);
    }, 700);

    return () => clearTimeout(autosaveRef.current);
  }, [form]);

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const toggleReportedTo = (opt) => {
    const arr = [...form.incident_reported_to];
    const idx = arr.indexOf(opt);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(opt);
    update("incident_reported_to", arr);
  };

  // ---------------------------------------------------------
  // VALIDATION
  // ---------------------------------------------------------
  const validate = () => {
    const e = {};

    // basic required Q1–Q6
    if (!form.type_of_incident) e.type_of_incident = "Required.";
    if (form.type_of_incident === "Other" && !form.other_type_text) e.other_type_text = "Please specify.";
    if (!form.date_of_report) e.date_of_report = "Required.";
    if (!form.time_of_report) e.time_of_report = "Required.";
    if (!form.impacted_name) e.impacted_name = "Required.";
    if (!form.impacted_employee_id) e.impacted_employee_id = "Required.";

    if (form.was_reported_verbally === null)
      e.was_reported_verbally = "Please select Yes or No.";

    // If YES, require reported_to fields
    if (form.was_reported_verbally === true) {
      if (!form.incident_reported_to.length)
        e.incident_reported_to = "Select at least one.";

      if (!form.reported_to_details.trim())
        e.reported_to_details = "Required.";
    }

    // After Q6 — all remaining required fields
    if (!form.location.trim()) e.location = "Required.";
    if (!form.reported_by_name.trim()) e.reported_by_name = "Required.";
    if (!form.reported_by_employee_id.trim()) e.reported_by_employee_id = "Required.";
    if (!form.reported_by_email.trim()) e.reported_by_email = "Required.";
    if (!form.reported_by_contact.trim()) e.reported_by_contact = "Required.";
    if (!form.date_of_incident) e.date_of_incident = "Required.";
    if (!form.time_of_incident) e.time_of_incident = "Required.";
    if (!form.detailed_description.trim()) e.detailed_description = "Required.";
    if (!form.immediate_actions_taken.trim()) e.immediate_actions_taken = "Required.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ---------------------------------------------------------
  // SUBMIT
  // ---------------------------------------------------------
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const payloadObj = {
      ...form,
      was_reported_verbally: !!form.was_reported_verbally
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
      if (!res.ok) throw new Error(data.detail);

      alert("Submitted Successfully. ID: " + data.id);
      localStorage.removeItem("incident_draft");
      setForm(emptyForm);
      setFiles([]);
      if (onSubmitted) onSubmitted(data);

    } catch (err) {
      alert("Submit failed: " + err.message);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem("incident_draft");
    setForm(emptyForm);
    setFiles([]);
  };

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------
  return (
    <div className="incident-card">
      <h2>Incident Reporting Form</h2>

      <form onSubmit={handleSubmit} className="incident-form">
        
        {/* ---------------------------------------------------------
           ALWAYS SHOW Q1 → Q6  (YOUR REQUIREMENT)
        --------------------------------------------------------- */}

        {/* Q1 Type */}
        <div className="row">
          <label>1. Type of Incident / Accident *</label>
          <select
            value={form.type_of_incident}
            onChange={(e) => update("type_of_incident", e.target.value)}
          >
            <option value="">-- Select --</option>
            {INCIDENT_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          {form.type_of_incident === "Other" && (
            <input
              className="mt8"
              placeholder="Enter incident type"
              value={form.other_type_text}
              onChange={(e) => update("other_type_text", e.target.value)}
            />
          )}
          {errors.type_of_incident && <div className="error">{errors.type_of_incident}</div>}
          {errors.other_type_text && <div className="error">{errors.other_type_text}</div>}
        </div>

        {/* Q2 + Q3 */}
        <div className="row row-grid-2">
          <div>
            <label>2. Date of Report *</label>
            <input type="date" value={form.date_of_report} onChange={e => update("date_of_report", e.target.value)} />
            {errors.date_of_report && <div className="error">{errors.date_of_report}</div>}
          </div>
          <div>
            <label>3. Time of Report *</label>
            <input type="time" value={form.time_of_report} onChange={e => update("time_of_report", e.target.value)} />
            {errors.time_of_report && <div className="error">{errors.time_of_report}</div>}
          </div>
        </div>

        {/* Q4 + Q5 */}
        <div className="row row-grid-2">
          <div>
            <label>4. Name of Impacted Person *</label>
            <input value={form.impacted_name} onChange={e => update("impacted_name", e.target.value)} />
            {errors.impacted_name && <div className="error">{errors.impacted_name}</div>}
          </div>
          <div>
            <label>5. Employee ID *</label>
            <input value={form.impacted_employee_id} onChange={e => update("impacted_employee_id", e.target.value)} />
            {errors.impacted_employee_id && <div className="error">{errors.impacted_employee_id}</div>}
          </div>
        </div>

        {/* Q6 Verbal report */}
        <div className="row">
          <label>6. Was this incident reported verbally? *</label>
          <div className="radio-row">
            <label>
              <input
                type="radio"
                name="vr"
                checked={form.was_reported_verbally === true}
                onChange={() => update("was_reported_verbally", true)}
              /> Yes
            </label>

            <label>
              <input
                type="radio"
                name="vr"
                checked={form.was_reported_verbally === false}
                onChange={() => update("was_reported_verbally", false)}
              /> No
            </label>
          </div>
          {errors.was_reported_verbally && <div className="error">{errors.was_reported_verbally}</div>}
        </div>

        {/* ---------------------------------------------------------
            AFTER Q6 — Show YES/NO dependent fields
        --------------------------------------------------------- */}

        {form.was_reported_verbally === true && (
          <>
            <div className="row">
              <label>7. Incident reported to *</label>
              <div className="checkbox-grid">
                {REPORTED_TO_OPTIONS.map(opt => (
                  <label key={opt}>
                    <input
                      type="checkbox"
                      checked={form.incident_reported_to.includes(opt)}
                      onChange={() => toggleReportedTo(opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
              {errors.incident_reported_to && <div className="error">{errors.incident_reported_to}</div>}
            </div>

            <div className="row">
              <label>8. Name & Department *</label>
              <input
                value={form.reported_to_details}
                onChange={(e) => update("reported_to_details", e.target.value)}
              />
              {errors.reported_to_details && <div className="error">{errors.reported_to_details}</div>}
            </div>
          </>
        )}

        {/* ---------------------------------------------------------
          REMAINING QUESTIONS (9 onward)
        --------------------------------------------------------- */}

        <div className="row">
          <label>9. Location *</label>
          <input value={form.location} onChange={(e) => update("location", e.target.value)} />
          {errors.location && <div className="error">{errors.location}</div>}
        </div>

        {/* Many remaining fields unchanged — SAME AS BEFORE */}
        {/* [...] KEEP YOUR EXISTING CODE FOR Q10–21 HERE */}

        {/* Buttons */}
        <div className="form-actions">
          <button className="btn primary" type="submit">Submit</button>
          <button onClick={clearDraft} type="button" className="btn outline">Clear Draft</button>
          <div className="muted">{saving ? "Saving draft..." : "Draft saved"}</div>
        </div>

      </form>
    </div>
  );
}