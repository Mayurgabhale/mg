Basic Info
Incident Details
People Involved
Analysis & Actions
Attachments
i dont want this  why you create this give me my origina form ok i dont want in sectin ok 



// C:\Users\W0024618\Desktop\IncidentDashboard\frontend\src\components\IncidentForm.jsx
import React, { useEffect, useRef, useState } from "react";
import "../assets/css/IncidentForm.css";

// Icons for better UI
import {
  FaUser, FaCalendar, FaClock, FaIdCard, FaExclamationTriangle,
  FaMapMarkerAlt, FaEnvelope, FaPhone, FaFileUpload, FaPrint,
  FaSave, FaTrash, FaPlus, FaTimes, FaMoon, FaSun
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
  const [activeSection, setActiveSection] = useState("basic");
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

  // Progress calculation
  const totalFields = 21;
  const filledFields = Object.values(form).filter(val => {
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === 'boolean') return true;
    return val && val.toString().trim() !== '';
  }).length;
  const progress = Math.round((filledFields / totalFields) * 100);

  return (
    <div className={`incident-form-container ${darkMode ? 'dark' : 'light'}`}>
      {/* Header with progress and theme toggle */}
      <div className="form-header">
        <div className="header-left">
          <div className="form-logo">
            <FaExclamationTriangle className="logo-icon" />
            <div>
              <h1>Western Union Incident Report</h1>
              <p className="subtitle">Safety & Security Reporting System</p>
            </div>
          </div>
        </div>
        
        <div className="header-right">
          <button 
            type="button" 
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          
          <div className="progress-container">
            <div className="progress-label">Completion: {progress}%</div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Navigation */}
      <div className="form-navigation">
        <button 
          className={`nav-btn ${activeSection === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveSection('basic')}
        >
          <FaUser /> Basic Info
        </button>
        <button 
          className={`nav-btn ${activeSection === 'details' ? 'active' : ''}`}
          onClick={() => setActiveSection('details')}
          disabled={!showAfterSix}
        >
          <FaExclamationTriangle /> Incident Details
        </button>
        <button 
          className={`nav-btn ${activeSection === 'people' ? 'active' : ''}`}
          onClick={() => setActiveSection('people')}
          disabled={!showAfterSix}
        >
          <FaUser /> People Involved
        </button>
        <button 
          className={`nav-btn ${activeSection === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveSection('analysis')}
          disabled={!showAfterSix}
        >
          <FaClock /> Analysis & Actions
        </button>
        <button 
          className={`nav-btn ${activeSection === 'attachments' ? 'active' : ''}`}
          onClick={() => setActiveSection('attachments')}
          disabled={!showAfterSix}
        >
          <FaFileUpload /> Attachments
        </button>
      </div>

      {/* Form Content */}
      <form className="incident-form" onSubmit={handleSubmit} noValidate>
        {/* Save Status */}
        <div className={`save-status ${saving ? 'saving' : 'saved'}`}>
          {saving ? (
            <>
              <FaSave className="spin" /> Saving draft...
            </>
          ) : (
            <>
              <FaSave /> Draft saved locally
            </>
          )}
        </div>

        {/* Section 1: Basic Information (Always Visible) */}
        {(activeSection === 'basic' || !showAfterSix) && (
          <div className="form-section">
            <div className="section-header">
              <h2><FaUser /> Basic Incident Information</h2>
              <p>Complete questions 1-6 to proceed</p>
            </div>

            <div className="form-grid">
              {/* Question 1 */}
              <div className={`form-group ${errors.type_of_incident ? 'error' : ''}`}>
                <label className="form-label">
                  <span className="question-number">1</span>
                  Type of Incident / Accident <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <FaExclamationTriangle />
                  <select 
                    className="form-select"
                    value={form.type_of_incident} 
                    onChange={e => update("type_of_incident", e.target.value)}
                  >
                    <option value="">Select incident type</option>
                    {INCIDENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                {errors.type_of_incident && (
                  <div className="error-message">{errors.type_of_incident}</div>
                )}
                {form.type_of_incident === "Other" && (
                  <div className="input-with-icon mt-2">
                    <FaExclamationTriangle />
                    <input 
                      className="form-input"
                      placeholder="Please specify the incident type"
                      value={form.other_type_text}
                      onChange={e => update("other_type_text", e.target.value)}
                    />
                    {errors.other_type_text && (
                      <div className="error-message">{errors.other_type_text}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Question 2 & 3 */}
              <div className="form-row">
                <div className={`form-group ${errors.date_of_report ? 'error' : ''}`}>
                  <label className="form-label">
                    <span className="question-number">2</span>
                    Date of Report <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <FaCalendar />
                    <input 
                      type="date" 
                      className="form-input"
                      value={form.date_of_report} 
                      onChange={e => update("date_of_report", e.target.value)} 
                    />
                  </div>
                  {errors.date_of_report && (
                    <div className="error-message">{errors.date_of_report}</div>
                  )}
                </div>

                <div className={`form-group ${errors.time_of_report ? 'error' : ''}`}>
                  <label className="form-label">
                    <span className="question-number">3</span>
                    Time of Report <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <FaClock />
                    <input 
                      type="time" 
                      className="form-input"
                      value={form.time_of_report} 
                      onChange={e => update("time_of_report", e.target.value)} 
                    />
                  </div>
                  {errors.time_of_report && (
                    <div className="error-message">{errors.time_of_report}</div>
                  )}
                </div>
              </div>

              {/* Question 4 & 5 */}
              <div className="form-row">
                <div className={`form-group ${errors.impacted_name ? 'error' : ''}`}>
                  <label className="form-label">
                    <span className="question-number">4</span>
                    Impacted Person Name <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <FaUser />
                    <input 
                      className="form-input"
                      placeholder="Full name"
                      value={form.impacted_name} 
                      onChange={e => update("impacted_name", e.target.value)} 
                    />
                  </div>
                  {errors.impacted_name && (
                    <div className="error-message">{errors.impacted_name}</div>
                  )}
                </div>

                <div className={`form-group ${errors.impacted_employee_id ? 'error' : ''}`}>
                  <label className="form-label">
                    <span className="question-number">5</span>
                    Impacted Employee ID <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <FaIdCard />
                    <input 
                      className="form-input"
                      placeholder="Employee ID"
                      value={form.impacted_employee_id} 
                      onChange={e => update("impacted_employee_id", e.target.value)} 
                    />
                  </div>
                  {errors.impacted_employee_id && (
                    <div className="error-message">{errors.impacted_employee_id}</div>
                  )}
                </div>
              </div>

              {/* Question 6 */}
              <div className={`form-group ${errors.was_reported_verbally ? 'error' : ''}`}>
                <label className="form-label">
                  <span className="question-number">6</span>
                  Was this incident reported verbally before submitting this report? <span className="required">*</span>
                </label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input 
                      type="radio" 
                      name="reported" 
                      checked={form.was_reported_verbally === true} 
                      onChange={() => update("was_reported_verbally", true)} 
                    />
                    <span className="radio-custom"></span>
                    Yes
                  </label>
                  <label className="radio-option">
                    <input 
                      type="radio" 
                      name="reported" 
                      checked={form.was_reported_verbally === false} 
                      onChange={() => update("was_reported_verbally", false)} 
                    />
                    <span className="radio-custom"></span>
                    No
                  </label>
                </div>
                {errors.was_reported_verbally && (
                  <div className="error-message">{errors.was_reported_verbally}</div>
                )}
                <div className="form-note">
                  <FaExclamationTriangle /> In case of medical emergency, inform local HR immediately
                </div>
              </div>

              {/* Continue Button */}
              {!showAfterSix && (
                <div className="continue-section">
                  <button 
                    type="button" 
                    className="btn-primary continue-btn"
                    onClick={() => {
                      if (form.was_reported_verbally !== null) {
                        setShowAfterSix(true);
                        setActiveSection('details');
                      } else {
                        setErrors({ was_reported_verbally: "Please select Yes or No to continue" });
                      }
                    }}
                  >
                    Continue to Incident Details →
                  </button>
                  <p className="continue-note">
                    Complete questions 1-6 to unlock the rest of the form
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section 2: Incident Details (Only after Q6) */}
        {showAfterSix && activeSection === 'details' && (
          <div className="form-section">
            <div className="section-header">
              <h2><FaExclamationTriangle /> Incident Details</h2>
              <p>Complete details about the incident</p>
            </div>

            <div className="form-grid">
              {/* Questions 7-8 (Only if verbally reported) */}
              {form.was_reported_verbally === true && (
                <>
                  <div className={`form-group ${errors.incident_reported_to ? 'error' : ''}`}>
                    <label className="form-label">
                      <span className="question-number">7</span>
                      Incident Reported To <span className="required">*</span>
                    </label>
                    <div className="input-with-icon">
                      <FaUser />
                      <select
                        className="form-select"
                        value={form.incident_reported_to[0] || ""}
                        onChange={e => update("incident_reported_to", [e.target.value])}
                      >
                        <option value="">Select person</option>
                        {REPORTED_TO_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    {errors.incident_reported_to && (
                      <div className="error-message">{errors.incident_reported_to}</div>
                    )}
                  </div>

                  <div className={`form-group ${errors.reported_to_details ? 'error' : ''}`}>
                    <label className="form-label">
                      <span className="question-number">8</span>
                      To Whom (Name & Department) <span className="required">*</span>
                    </label>
                    <div className="input-with-icon">
                      <FaUser />
                      <input 
                        className="form-input"
                        placeholder="Name and department"
                        value={form.reported_to_details} 
                        onChange={e => update("reported_to_details", e.target.value)} 
                      />
                    </div>
                    {errors.reported_to_details && (
                      <div className="error-message">{errors.reported_to_details}</div>
                    )}
                  </div>
                </>
              )}

              {/* Question 9 */}
              <div className={`form-group ${errors.location ? 'error' : ''}`}>
                <label className="form-label">
                  <span className="question-number">9</span>
                  Location of Incident <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <FaMapMarkerAlt />
                  <input 
                    className="form-input"
                    placeholder="Office / Branch / Specific location"
                    value={form.location} 
                    onChange={e => update("location", e.target.value)} 
                  />
                </div>
                {errors.location && (
                  <div className="error-message">{errors.location}</div>
                )}
              </div>

              {/* Questions 10-12 */}
              <div className="form-row">
                <div className={`form-group ${errors.reported_by_name ? 'error' : ''}`}>
                  <label className="form-label">
                    <span className="question-number">10</span>
                    Reporter Name <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <FaUser />
                    <input 
                      className="form-input"
                      placeholder="Your full name"
                      value={form.reported_by_name} 
                      onChange={e => update("reported_by_name", e.target.value)} 
                    />
                  </div>
                  {errors.reported_by_name && (
                    <div className="error-message">{errors.reported_by_name}</div>
                  )}
                </div>

                <div className={`form-group ${errors.reported_by_employee_id ? 'error' : ''}`}>
                  <label className="form-label">
                    <span className="question-number">11</span>
                    Reporter Employee ID <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <FaIdCard />
                    <input 
                      className="form-input"
                      placeholder="Your employee ID"
                      value={form.reported_by_employee_id} 
                      onChange={e => update("reported_by_employee_id", e.target.value)} 
                    />
                  </div>
                  {errors.reported_by_employee_id && (
                    <div className="error-message">{errors.reported_by_employee_id}</div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className={`form-group ${errors.reported_by_email ? 'error' : ''}`}>
                  <label className="form-label">
                    <span className="question-number">12</span>
                    Reporter Email <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <FaEnvelope />
                    <input 
                      className="form-input"
                      placeholder="your.email@westernunion.com"
                      value={form.reported_by_email} 
                      onChange={e => update("reported_by_email", e.target.value)} 
                    />
                  </div>
                  {errors.reported_by_email && (
                    <div className="error-message">{errors.reported_by_email}</div>
                  )}
                </div>

                <div className={`form-group ${errors.reported_by_contact ? 'error' : ''}`}>
                  <label className="form-label">
                    <span className="question-number">12b</span>
                    Reporter Contact <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <FaPhone />
                    <input 
                      className="form-input"
                      placeholder="Phone number"
                      value={form.reported_by_contact} 
                      onChange={e => update("reported_by_contact", e.target.value)} 
                    />
                  </div>
                  {errors.reported_by_contact && (
                    <div className="error-message">{errors.reported_by_contact}</div>
                  )}
                </div>
              </div>

              {/* Questions 13-14 */}
              <div className="form-row">
                <div className={`form-group ${errors.date_of_incident ? 'error' : ''}`}>
                  <label className="form-label">
                    <span className="question-number">13</span>
                    Date of Incident <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <FaCalendar />
                    <input 
                      type="date" 
                      className="form-input"
                      value={form.date_of_incident} 
                      onChange={e => update("date_of_incident", e.target.value)} 
                    />
                  </div>
                  {errors.date_of_incident && (
                    <div className="error-message">{errors.date_of_incident}</div>
                  )}
                </div>

                <div className={`form-group ${errors.time_of_incident ? 'error' : ''}`}>
                  <label className="form-label">
                    <span className="question-number">14</span>
                    Time of Incident <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <FaClock />
                    <input 
                      type="time" 
                      className="form-input"
                      value={form.time_of_incident} 
                      onChange={e => update("time_of_incident", e.target.value)} 
                    />
                  </div>
                  {errors.time_of_incident && (
                    <div className="error-message">{errors.time_of_incident}</div>
                  )}
                </div>
              </div>

              {/* Question 15 */}
              <div className={`form-group ${errors.detailed_description ? 'error' : ''}`}>
                <label className="form-label">
                  <span className="question-number">15</span>
                  Detailed Description <span className="required">*</span>
                </label>
                <textarea 
                  className="form-textarea"
                  placeholder="Provide a detailed description of what happened..."
                  rows={4}
                  value={form.detailed_description} 
                  onChange={e => update("detailed_description", e.target.value)} 
                />
                {errors.detailed_description && (
                  <div className="error-message">{errors.detailed_description}</div>
                )}
              </div>

              {/* Question 16 */}
              <div className={`form-group ${errors.immediate_actions_taken ? 'error' : ''}`}>
                <label className="form-label">
                  <span className="question-number">16</span>
                  Immediate Actions Taken <span className="required">*</span>
                </label>
                <textarea 
                  className="form-textarea"
                  placeholder="Describe immediate actions taken..."
                  rows={3}
                  value={form.immediate_actions_taken} 
                  onChange={e => update("immediate_actions_taken", e.target.value)} 
                />
                {errors.immediate_actions_taken && (
                  <div className="error-message">{errors.immediate_actions_taken}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Section 3: People Involved */}
        {showAfterSix && activeSection === 'people' && (
          <div className="form-section">
            <div className="section-header">
              <h2><FaUser /> People Involved</h2>
              <p>Add accompanying persons and witnesses</p>
            </div>

            <div className="form-grid">
              {/* Question 17 */}
              <div className="form-group">
                <label className="form-label">
                  <span className="question-number">17</span>
                  Accompanying Person Details
                </label>
                <div className="dynamic-list">
                  {(form.accompanying_person || []).map((p, i) => (
                    <div key={i} className="dynamic-item">
                      <div className="dynamic-inputs">
                        <div className="input-with-icon">
                          <FaUser />
                          <input 
                            className="form-input"
                            placeholder="Name"
                            value={p.name} 
                            onChange={e => setAccompany(i, "name", e.target.value)} 
                          />
                        </div>
                        <div className="input-with-icon">
                          <FaPhone />
                          <input 
                            className="form-input"
                            placeholder="Contact"
                            value={p.contact} 
                            onChange={e => setAccompany(i, "contact", e.target.value)} 
                          />
                        </div>
                      </div>
                      <button 
                        type="button" 
                        className="remove-btn"
                        onClick={() => removeAccompany(i)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className="add-btn"
                    onClick={addAccompany}
                  >
                    <FaPlus /> Add Accompanying Person
                  </button>
                </div>
              </div>

              {/* Questions 18-19 */}
              <div className={`form-group ${errors.witness_contacts ? 'error' : ''}`}>
                <label className="form-label">
                  <span className="question-number">18-19</span>
                  Witnesses & Contact Numbers
                </label>
                <div className="dynamic-list">
                  {(form.witnesses || []).map((w, i) => (
                    <div key={i} className="dynamic-item">
                      <div className="dynamic-inputs">
                        <div className="input-with-icon">
                          <FaUser />
                          <input 
                            className="form-input"
                            placeholder="Witness Name"
                            value={w} 
                            onChange={e => setWitness(i, e.target.value)} 
                          />
                        </div>
                        <div className="input-with-icon">
                          <FaPhone />
                          <input 
                            className="form-input"
                            placeholder="Contact"
                            value={(form.witness_contacts || [])[i] || ""} 
                            onChange={e => setWitnessContact(i, e.target.value)} 
                          />
                        </div>
                      </div>
                      <button 
                        type="button" 
                        className="remove-btn"
                        onClick={() => removeWitness(i)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className="add-btn"
                    onClick={addWitness}
                  >
                    <FaPlus /> Add Witness
                  </button>
                </div>
                {errors.witness_contacts && (
                  <div className="error-message">{errors.witness_contacts}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Analysis & Actions */}
        {showAfterSix && activeSection === 'analysis' && (
          <div className="form-section">
            <div className="section-header">
              <h2><FaClock /> Analysis & Actions</h2>
              <p>Root cause analysis and preventive measures</p>
            </div>

            <div className="form-grid">
              {/* Question 20 */}
              <div className="form-group">
                <label className="form-label">
                  <span className="question-number">20</span>
                  Root Cause Analysis
                </label>
                <textarea 
                  className="form-textarea"
                  placeholder="Analysis of what caused the incident..."
                  rows={4}
                  value={form.root_cause_analysis} 
                  onChange={e => update("root_cause_analysis", e.target.value)} 
                />
              </div>

              {/* Question 21 */}
              <div className="form-group">
                <label className="form-label">
                  <span className="question-number">21</span>
                  Preventive Actions
                </label>
                <textarea 
                  className="form-textarea"
                  placeholder="Actions taken to prevent future incidents..."
                  rows={4}
                  value={form.preventive_actions} 
                  onChange={e => update("preventive_actions", e.target.value)} 
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 5: Attachments */}
        {showAfterSix && activeSection === 'attachments' && (
          <div className="form-section">
            <div className="section-header">
              <h2><FaFileUpload /> Attachments</h2>
              <p>Upload supporting documents and images</p>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  <FaFileUpload /> Upload Supporting Files
                </label>
                <div className="file-upload-area">
                  <input 
                    type="file" 
                    id="file-upload"
                    multiple 
                    onChange={onFilesSelected} 
                    className="file-input"
                  />
                  <label htmlFor="file-upload" className="file-upload-label">
                    <FaFileUpload className="upload-icon" />
                    <div>Click to upload or drag & drop</div>
                    <small>Supports images, PDF, DOC (Max 10MB each)</small>
                  </label>
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
                          className="remove-file-btn"
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
          </div>
        )}

        {/* Form Actions */}
        {showAfterSix && (
          <div className="form-actions">
            <div className="action-buttons">
              <button type="submit" className="btn-primary submit-btn">
                <FaExclamationTriangle /> Submit Incident Report
              </button>
              <button type="button" className="btn-secondary" onClick={clearDraft}>
                <FaTrash /> Clear All
              </button>
              <button type="button" className="btn-secondary" onClick={handlePrint}>
                <FaPrint /> Print/PDF
              </button>
            </div>
            
            <div className="form-footer">
              <p className="confidential-note">
                <strong>Confidential:</strong> This information will only be accessible to authorized Western Union safety personnel.
              </p>
              <p className="support-note">
                Need help? Contact Safety Department: safety@westernunion.com | Ext: 5555
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

