// C:\Users\W0024618\Desktop\IncidentDashboard\frontend\src\components\IncidentForm.jsx
import React, { useEffect, useRef, useState } from "react";
import "../assets/css/IncidentForm.css";

// Optional: Add these icons if you want, or remove if not needed
import {
  FaSave, FaTrash, FaPrint, FaPlus, FaTimes,
  FaMoon, FaSun, FaExclamationTriangle
} from "react-icons/fa";

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
  const [darkMode, setDarkMode] = useState(false);
  const [showAfterSix, setShowAfterSix] = useState(false);
  const autosaveRef = useRef(null);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // Restore draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem("incident_draft");
      if (raw) setForm(prev => ({ ...prev, ...JSON.parse(raw) }));
    } catch (e) {
      console.warn("Restore draft failed", e);
    }
  }, []);

  // Auto-save
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
      setShowAfterSix(true);
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

  // Validation functions (unchanged)
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
    <div className={`incident-form-container ${darkMode ? 'dark' : 'light'}`}>
      {/* Form Header */}
      <div className="form-header">
        <div className="header-content">
          <div className="logo-section">
            <FaExclamationTriangle className="logo-icon" />
            <div>
              <h1>Incident Reporting Form</h1>
              <p className="subtitle">Western Union Safety & Security System</p>
            </div>
          </div>
          
          <div className="header-actions">
            <button 
              type="button" 
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            
            <div className={`save-status ${saving ? 'saving' : 'saved'}`}>
              {saving ? (
                <>
                  <FaSave className="spin-icon" /> Saving draft...
                </>
              ) : (
                <>
                  <FaSave /> Draft saved locally
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="form-intro">
          <p>When you submit this form, it will not automatically collect your details like name and email address unless you provide it yourself.</p>
        </div>
      </div>

      {/* Main Form - Single Page */}
      <form className="incident-form" onSubmit={handleSubmit} noValidate>
        
        {/* Question 1 */}
        <div className="form-section">
          <div className={`form-group ${errors.type_of_incident ? 'error' : ''}`}>
            <label className="form-label">
              <span className="question-number">1</span>
              Type of Incident / Accident <span className="required">*</span>
            </label>
            <select 
              className="form-select"
              value={form.type_of_incident} 
              onChange={e => update("type_of_incident", e.target.value)}
            >
              <option value="">-- select type --</option>
              {INCIDENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.type_of_incident && <div className="error-message">{errors.type_of_incident}</div>}
            
            {form.type_of_incident === "Other" && (
              <div className="form-group">
                <input 
                  className="form-input"
                  type="text" 
                  placeholder="Please enter the incident type" 
                  value={form.other_type_text} 
                  onChange={e => update("other_type_text", e.target.value)} 
                />
                {errors.other_type_text && <div className="error-message">{errors.other_type_text}</div>}
              </div>
            )}
          </div>
        </div>

        {/* Questions 2 & 3 */}
        <div className="form-row">
          <div className={`form-group ${errors.date_of_report ? 'error' : ''}`}>
            <label className="form-label">
              <span className="question-number">2</span>
              Date of Report <span className="required">*</span>
            </label>
            <input 
              type="date" 
              className="form-input"
              value={form.date_of_report} 
              onChange={e => update("date_of_report", e.target.value)} 
            />
            {errors.date_of_report && <div className="error-message">{errors.date_of_report}</div>}
          </div>

          <div className={`form-group ${errors.time_of_report ? 'error' : ''}`}>
            <label className="form-label">
              <span className="question-number">3</span>
              Time of Report (HH:MM) <span className="required">*</span>
            </label>
            <input 
              type="time" 
              className="form-input"
              value={form.time_of_report} 
              onChange={e => update("time_of_report", e.target.value)} 
            />
            {errors.time_of_report && <div className="error-message">{errors.time_of_report}</div>}
          </div>
        </div>

        {/* Questions 4 & 5 */}
        <div className="form-row">
          <div className={`form-group ${errors.impacted_name ? 'error' : ''}`}>
            <label className="form-label">
              <span className="question-number">4</span>
              Name of Impacted Employee / Person <span className="required">*</span>
            </label>
            <input 
              className="form-input"
              value={form.impacted_name} 
              onChange={e => update("impacted_name", e.target.value)} 
              placeholder="Full name"
            />
            {errors.impacted_name && <div className="error-message">{errors.impacted_name}</div>}
          </div>

          <div className={`form-group ${errors.impacted_employee_id ? 'error' : ''}`}>
            <label className="form-label">
              <span className="question-number">5</span>
              Employee ID of Impacted Employee <span className="required">*</span>
            </label>
            <input 
              className="form-input"
              value={form.impacted_employee_id} 
              onChange={e => update("impacted_employee_id", e.target.value)} 
              placeholder="Employee ID"
            />
            {errors.impacted_employee_id && <div className="error-message">{errors.impacted_employee_id}</div>}
          </div>
        </div>

        {/* Question 6 */}
        <div className="form-section">
          <div className={`form-group ${errors.was_reported_verbally ? 'error' : ''}`}>
            <label className="form-label">
              <span className="question-number">6</span>
              Was this incident reported verbally before submitting this report? <span className="required">*</span>
            </label>
            <div className="radio-group">
              <label className="radio-option">
                <input 
                  type="radio" 
                  checked={form.was_reported_verbally === true} 
                  onChange={() => update("was_reported_verbally", true)} 
                />
                <span className="radio-custom"></span>
                Yes
              </label>
              <label className="radio-option">
                <input 
                  type="radio" 
                  checked={form.was_reported_verbally === false} 
                  onChange={() => update("was_reported_verbally", false)} 
                />
                <span className="radio-custom"></span>
                No
              </label>
            </div>
            {errors.was_reported_verbally && <div className="error-message">{errors.was_reported_verbally}</div>}
            <div className="form-note">
              <FaExclamationTriangle /> ** In case of medical emergency inform local HR
            </div>
          </div>
        </div>

        {/* Questions 7-21 (Shown after Q6) */}
        {showAfterSix && (
          <>
            {/* Questions 7-8 (Only if Yes to Q6) */}
            {form.was_reported_verbally === true && (
              <>
                <div className="form-section">
                  <div className={`form-group ${errors.incident_reported_to ? 'error' : ''}`}>
                    <label className="form-label">
                      <span className="question-number">7</span>
                      Incident reported to: (select one or more) <span className="required">*</span>
                    </label>
                    <div className="checkbox-group">
                      {REPORTED_TO_OPTIONS.map(opt => (
                        <label key={opt} className="checkbox-option">
                          <input 
                            type="checkbox"
                            checked={(form.incident_reported_to || []).includes(opt)}
                            onChange={() => toggleReportedTo(opt)} 
                          />
                          <span className="checkbox-custom"></span>
                          {opt}
                        </label>
                      ))}
                    </div>
                    {errors.incident_reported_to && <div className="error-message">{errors.incident_reported_to}</div>}
                  </div>
                </div>

                <div className="form-section">
                  <div className={`form-group ${errors.reported_to_details ? 'error' : ''}`}>
                    <label className="form-label">
                      <span className="question-number">8</span>
                      If Yes, to whom (Name and Department): <span className="required">*</span>
                    </label>
                    <input 
                      className="form-input"
                      value={form.reported_to_details} 
                      onChange={e => update("reported_to_details", e.target.value)} 
                      placeholder="Name and department"
                    />
                    {errors.reported_to_details && <div className="error-message">{errors.reported_to_details}</div>}
                  </div>
                </div>
              </>
            )}

            {/* Question 9 */}
            <div className="form-section">
              <div className={`form-group ${errors.location ? 'error' : ''}`}>
                <label className="form-label">
                  <span className="question-number">9</span>
                  Location of Incident or Accident (Specify Office / Branch) <span className="required">*</span>
                </label>
                <input 
                  className="form-input"
                  value={form.location} 
                  onChange={e => update("location", e.target.value)} 
                  placeholder="Office / Branch / Specific location"
                />
                {errors.location && <div className="error-message">{errors.location}</div>}
              </div>
            </div>

            {/* Questions 10-12 */}
            <div className="form-row">
              <div className={`form-group ${errors.reported_by_name ? 'error' : ''}`}>
                <label className="form-label">
                  <span className="question-number">10</span>
                  Reported By - Name <span className="required">*</span>
                </label>
                <input 
                  className="form-input"
                  value={form.reported_by_name} 
                  onChange={e => update("reported_by_name", e.target.value)} 
                  placeholder="Your full name"
                />
                {errors.reported_by_name && <div className="error-message">{errors.reported_by_name}</div>}
              </div>

              <div className={`form-group ${errors.reported_by_employee_id ? 'error' : ''}`}>
                <label className="form-label">
                  <span className="question-number">11</span>
                  Reported By - Employee ID <span className="required">*</span>
                </label>
                <input 
                  className="form-input"
                  value={form.reported_by_employee_id} 
                  onChange={e => update("reported_by_employee_id", e.target.value)} 
                  placeholder="Your employee ID"
                />
                {errors.reported_by_employee_id && <div className="error-message">{errors.reported_by_employee_id}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className={`form-group ${errors.reported_by_email ? 'error' : ''}`}>
                <label className="form-label">
                  <span className="question-number">12</span>
                  Reported By - Email <span className="required">*</span>
                </label>
                <input 
                  className="form-input"
                  value={form.reported_by_email} 
                  onChange={e => update("reported_by_email", e.target.value)} 
                  placeholder="your.email@westernunion.com"
                />
                {errors.reported_by_email && <div className="error-message">{errors.reported_by_email}</div>}
              </div>

              <div className={`form-group ${errors.reported_by_contact ? 'error' : ''}`}>
                <label className="form-label">
                  <span className="question-number">12b</span>
                  Reported By - Contact Number <span className="required">*</span>
                </label>
                <input 
                  className="form-input"
                  value={form.reported_by_contact} 
                  onChange={e => update("reported_by_contact", e.target.value)} 
                  placeholder="Phone number"
                />
                {errors.reported_by_contact && <div className="error-message">{errors.reported_by_contact}</div>}
              </div>
            </div>

            {/* Questions 13-14 */}
            <div className="form-row">
              <div className={`form-group ${errors.date_of_incident ? 'error' : ''}`}>
                <label className="form-label">
                  <span className="question-number">13</span>
                  Date of Incident Occurred <span className="required">*</span>
                </label>
                <input 
                  type="date" 
                  className="form-input"
                  value={form.date_of_incident} 
                  onChange={e => update("date_of_incident", e.target.value)} 
                />
                {errors.date_of_incident && <div className="error-message">{errors.date_of_incident}</div>}
              </div>

              <div className={`form-group ${errors.time_of_incident ? 'error' : ''}`}>
                <label className="form-label">
                  <span className="question-number">14</span>
                  Time of Incident <span className="required">*</span>
                </label>
                <input 
                  type="time" 
                  className="form-input"
                  value={form.time_of_incident} 
                  onChange={e => update("time_of_incident", e.target.value)} 
                />
                {errors.time_of_incident && <div className="error-message">{errors.time_of_incident}</div>}
              </div>
            </div>

            {/* Question 15 */}
            <div className="form-section">
              <div className={`form-group ${errors.detailed_description ? 'error' : ''}`}>
                <label className="form-label">
                  <span className="question-number">15</span>
                  Detailed Description of Incident <span className="required">*</span>
                </label>
                <textarea 
                  className="form-textarea"
                  value={form.detailed_description} 
                  onChange={e => update("detailed_description", e.target.value)} 
                  rows={5}
                  placeholder="Provide detailed description of what happened..."
                />
                {errors.detailed_description && <div className="error-message">{errors.detailed_description}</div>}
              </div>
            </div>

            {/* Question 16 */}
            <div className="form-section">
              <div className={`form-group ${errors.immediate_actions_taken ? 'error' : ''}`}>
                <label className="form-label">
                  <span className="question-number">16</span>
                  Immediate Actions Taken <span className="required">*</span>
                </label>
                <textarea 
                  className="form-textarea"
                  value={form.immediate_actions_taken} 
                  onChange={e => update("immediate_actions_taken", e.target.value)} 
                  rows={3}
                  placeholder="Describe immediate actions taken..."
                />
                {errors.immediate_actions_taken && <div className="error-message">{errors.immediate_actions_taken}</div>}
              </div>
            </div>

            {/* Question 17 */}
            <div className="form-section">
              <div className="form-group">
                <label className="form-label">
                  <span className="question-number">17</span>
                  Accompanying Person Name and Contact Details
                </label>
                <div className="form-note">You can add multiple accompanying persons.</div>
                
                {(form.accompanying_person || []).map((p, i) => (
                  <div key={i} className="dynamic-row">
                    <input 
                      className="form-input"
                      placeholder="Name" 
                      value={p.name || ""} 
                      onChange={e => setAccompany(i, "name", e.target.value)} 
                    />
                    <input 
                      className="form-input"
                      placeholder="Contact" 
                      value={p.contact || ""} 
                      onChange={e => setAccompany(i, "contact", e.target.value)} 
                    />
                    <button 
                      type="button" 
                      className="btn-remove"
                      onClick={() => removeAccompany(i)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
                
                <button 
                  type="button" 
                  className="btn-add"
                  onClick={addAccompany}
                >
                  <FaPlus /> Add Accompanying Person
                </button>
              </div>
            </div>

            {/* Questions 18-19 */}
            <div className="form-section">
              <div className={`form-group ${errors.witness_contacts ? 'error' : ''}`}>
                <label className="form-label">
                  <span className="question-number">18-19</span>
                  Name of Witnesses & Contact Numbers
                </label>
                <div className="form-note">Add one witness per row.</div>
                
                {(form.witnesses || []).map((w, i) => (
                  <div key={i} className="dynamic-row">
                    <input 
                      className="form-input"
                      placeholder="Witness Name" 
                      value={w || ""} 
                      onChange={e => setWitness(i, e.target.value)} 
                    />
                    <input 
                      className="form-input"
                      placeholder="Contact" 
                      value={(form.witness_contacts || [])[i] || ""} 
                      onChange={e => setWitnessContact(i, e.target.value)} 
                    />
                    <button 
                      type="button" 
                      className="btn-remove"
                      onClick={() => removeWitness(i)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
                
                <button 
                  type="button" 
                  className="btn-add"
                  onClick={addWitness}
                >
                  <FaPlus /> Add Witness
                </button>
                {errors.witness_contacts && <div className="error-message">{errors.witness_contacts}</div>}
              </div>
            </div>

            {/* Question 20 */}
            <div className="form-section">
              <div className="form-group">
                <label className="form-label">
                  <span className="question-number">20</span>
                  Root cause analysis of the incident/accident
                </label>
                <textarea 
                  className="form-textarea"
                  value={form.root_cause_analysis} 
                  onChange={e => update("root_cause_analysis", e.target.value)} 
                  rows={3}
                  placeholder="Analysis of what caused the incident..."
                />
              </div>
            </div>

            {/* Question 21 */}
            <div className="form-section">
              <div className="form-group">
                <label className="form-label">
                  <span className="question-number">21</span>
                  Preventive actions taken during or after incident/accident (If any)
                </label>
                <textarea 
                  className="form-textarea"
                  value={form.preventive_actions} 
                  onChange={e => update("preventive_actions", e.target.value)} 
                  rows={3}
                  placeholder="Actions to prevent future incidents..."
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="form-section">
              <div className="form-group">
                <label className="form-label">
                  Attach files (images / pdf) — optional
                </label>
                <div className="file-upload-area">
                  <input 
                    type="file" 
                    multiple 
                    onChange={onFilesSelected} 
                    className="file-input"
                  />
                  <div className="file-upload-label">
                    <span>Click to upload or drag & drop files here</span>
                    <small>Supports images, PDF, DOC (Max 10MB each)</small>
                  </div>
                </div>
                
                {files.length > 0 && (
                  <div className="file-list">
                    <h4>Attached Files ({files.length})</h4>
                    {files.map((f, i) => (
                      <div key={i} className="file-item">
                        <div className="file-info">
                          <span className="file-name">{f.name}</span>
                          <span className="file-size">({Math.round(f.size / 1024)} KB)</span>
                        </div>
                        <button 
                          type="button" 
                          className="btn-remove"
                          onClick={() => removeFile(i)}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <div className="action-buttons">
                <button type="submit" className="btn-primary">
                  Submit Incident Report
                </button>
                <button type="button" className="btn-secondary" onClick={clearDraft}>
                  <FaTrash /> Clear Draft
                </button>
                <button type="button" className="btn-secondary" onClick={handlePrint}>
                  <FaPrint /> Print/PDF
                </button>
              </div>
              
              <div className="form-footer">
                <p className="confidential-note">
                  <strong>Confidential:</strong> All information submitted is protected and accessible only to authorized personnel.
                </p>
              </div>
            </div>
          </>
        )}

        {/* If Q6 not answered yet, show continue button */}
        {!showAfterSix && form.was_reported_verbally !== null && (
          <div className="continue-section">
            <button 
              type="button" 
              className="btn-continue"
              onClick={() => setShowAfterSix(true)}
            >
              Continue to Complete Form →
            </button>
          </div>
        )}
      </form>
    </div>
  );
}