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
  const [touched, setTouched] = useState({});
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

  // Enhanced phone number validation for international numbers
  const validatePhoneNumber = (phone) => {
    if (!phone || phone.trim() === "") {
      return { isValid: false, message: "Phone number is required" };
    }
    
    // Clean the phone number - remove all non-digit except leading +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // Check if it starts with + or digit
    if (!/^[\d+]/.test(phone)) {
      return { isValid: false, message: "Phone number must start with digit or +" };
    }
    
    // Remove + for length calculation
    const digitsOnly = cleaned.replace('+', '');
    
    // Check minimum and maximum length (for international numbers)
    if (digitsOnly.length < 6) {
      return { isValid: false, message: "Phone number too short (minimum 6 digits)" };
    }
    
    if (digitsOnly.length > 15) {
      return { isValid: false, message: "Phone number too long (maximum 15 digits)" };
    }
    
    // Validate format with libphonenumber-like logic
    // Allow formats: +[1-3 digits][rest], or just digits
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(cleaned)) {
      return { isValid: false, message: "Invalid phone number format" };
    }
    
    // Country code validation (basic)
    if (cleaned.startsWith('+')) {
      const countryCode = cleaned.match(/^\+\d{1,3}/);
      if (!countryCode) {
        return { isValid: false, message: "Invalid country code" };
      }
      
      // Check if the number after country code is valid
      const nationalNumber = cleaned.substring(countryCode[0].length);
      if (nationalNumber.length < 4) {
        return { isValid: false, message: "National number too short" };
      }
    }
    
    return { isValid: true, message: "" };
  };

  // Email validation
  const validateEmail = (email) => {
    if (!email || email.trim() === "") {
      return { isValid: false, message: "Email is required" };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: "Invalid email address format" };
    }
    
    // Additional validation for domain
    const parts = email.split('@');
    if (parts[1].split('.').length < 2) {
      return { isValid: false, message: "Invalid domain format" };
    }
    
    return { isValid: true, message: "" };
  };

  // Employee ID validation
  const validateEmployeeId = (empId) => {
    if (!empId || empId.trim() === "") {
      return { isValid: false, message: "Employee ID is required" };
    }
    
    const empIdRegex = /^[A-Za-z0-9\-_.]{1,20}$/;
    if (!empIdRegex.test(empId)) {
      return { isValid: false, message: "Invalid employee ID. Only letters, numbers, hyphens, underscores and periods allowed" };
    }
    
    return { isValid: true, message: "" };
  };

  // Required field validation
  const validateRequired = (value, fieldName) => {
    if (!value || (typeof value === 'string' && value.trim() === "")) {
      return { isValid: false, message: `${fieldName} is required` };
    }
    return { isValid: true, message: "" };
  };

  // Live validation function
  const validateField = (fieldName, value, customValidation = null) => {
    switch (fieldName) {
      case 'reported_by_email':
        return validateEmail(value);
      case 'reported_by_contact':
        return validatePhoneNumber(value);
      case 'reported_by_employee_id':
      case 'impacted_employee_id':
        return validateEmployeeId(value);
      case 'detailed_description':
        if (!value || value.trim().length < 5) {
          return { isValid: false, message: "Please provide a detailed description (min 5 chars)" };
        }
        return { isValid: true, message: "" };
      default:
        if (customValidation) {
          return customValidation(value);
        }
        return { isValid: true, message: "" };
    }
  };

  // Handle field change with live validation
  const handleFieldChange = (fieldName, value, validationFn = null) => {
    // Update form
    update(fieldName, value);
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    // Validate the field
    const validation = validateField(fieldName, value, validationFn);
    
    // Update errors
    setErrors(prev => {
      if (!validation.isValid) {
        return { ...prev, [fieldName]: validation.message };
      } else {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      }
    });
  };

  // Handle blur event for fields
  const handleBlur = (fieldName, value) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    // Special handling for radio buttons
    if (fieldName === 'was_reported_verbally') {
      if (value === null) {
        setErrors(prev => ({ ...prev, [fieldName]: "Please select Yes or No." }));
      } else {
        const newErrors = { ...errors };
        delete newErrors[fieldName];
        setErrors(newErrors);
      }
    }
  };

  const update = (k, v) => {
    if (k === "was_reported_verbally") {
      setShowAfterSix(true); // 👈 When user answers Q6 → show rest
      
      // Clear related errors when changing this field
      if (v === false) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors['incident_reported_to'];
          delete newErrors['reported_to_details'];
          return newErrors;
        });
      }
    }
    
    // For email and contact fields, trigger live validation
    if (k === 'reported_by_email' || k === 'reported_by_contact' || 
        k === 'reported_by_employee_id' || k === 'impacted_employee_id' ||
        k === 'detailed_description') {
      handleFieldChange(k, v);
    } else {
      setForm(prev => ({ ...prev, [k]: v }));
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

  const validate = () => {
    const e = {};

    if (form.was_reported_verbally === null)
      e.was_reported_verbally = "Please select Yes or No.";

    if (!form.type_of_incident) e.type_of_incident = "Type is required.";
    if (form.type_of_incident === "Other" && !form.other_type_text) e.other_type_text = "Please enter the incident type.";
    if (!form.date_of_report) e.date_of_report = "Date of report required.";
    if (!form.time_of_report) e.time_of_report = "Time of report required.";
    if (!form.impacted_name) e.impacted_name = "Impacted name is required.";
    
    // Use live validation functions
    const empIdValidation = validateEmployeeId(form.impacted_employee_id);
    if (!empIdValidation.isValid) e.impacted_employee_id = empIdValidation.message;

    if (form.was_reported_verbally === true) {
      if (!form.incident_reported_to?.length)
        e.incident_reported_to = "Select at least one option.";
      if (!form.reported_to_details?.trim())
        e.reported_to_details = "Provide name & department.";
    }

    if (!form.location?.trim()) e.location = "Location is required.";
    if (!form.reported_by_name) e.reported_by_name = "Reporter name required.";
    
    // Use live validation functions
    const reporterEmpIdValidation = validateEmployeeId(form.reported_by_employee_id);
    if (!reporterEmpIdValidation.isValid) e.reported_by_employee_id = reporterEmpIdValidation.message;
    
    const emailValidation = validateEmail(form.reported_by_email);
    if (!emailValidation.isValid) e.reported_by_email = emailValidation.message;
    
    const phoneValidation = validatePhoneNumber(form.reported_by_contact);
    if (!phoneValidation.isValid) e.reported_by_contact = phoneValidation.message;
    
    if (!form.date_of_incident) e.date_of_incident = "Date of incident required.";
    if (!form.time_of_incident) e.time_of_incident = "Time of incident required.";
    if (!form.detailed_description?.trim() || form.detailed_description.length < 5) e.detailed_description = "Please provide a detailed description (min 5 chars).";
    if (!form.immediate_actions_taken?.trim()) e.immediate_actions_taken = "Immediate actions are required.";

    if ((form.witnesses || []).length !== (form.witness_contacts || []).length)
      e.witness_contacts = "Add contact for each witness.";

    // Mark all fields as touched for final validation
    const allFields = [
      'type_of_incident', 'date_of_report', 'time_of_report', 'impacted_name',
      'impacted_employee_id', 'was_reported_verbally', 'location', 'reported_by_name',
      'reported_by_employee_id', 'reported_by_email', 'reported_by_contact',
      'date_of_incident', 'time_of_incident', 'detailed_description', 'immediate_actions_taken'
    ];
    
    const touchedAll = {};
    allFields.forEach(field => touchedAll[field] = true);
    if (form.was_reported_verbally === true) {
      touchedAll['incident_reported_to'] = true;
      touchedAll['reported_to_details'] = true;
    }
    setTouched(touchedAll);

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
          <select 
            value={form.type_of_incident} 
            onChange={e => update("type_of_incident", e.target.value)}
            onBlur={() => setTouched(prev => ({ ...prev, type_of_incident: true }))}
            className={touched.type_of_incident && errors.type_of_incident ? 'error-border' : ''}
          >
            <option value="">-- select type --</option>
            {INCIDENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {form.type_of_incident === "Other" && (
            <>
              <input 
                className={`mt8 ${touched.other_type_text && errors.other_type_text ? 'error-border' : ''}`}
                placeholder="Please enter the incident type" 
                value={form.other_type_text} 
                onChange={e => handleFieldChange("other_type_text", e.target.value, (val) => 
                  !val ? { isValid: false, message: "Please enter the incident type" } : { isValid: true, message: "" }
                )}
                onBlur={() => setTouched(prev => ({ ...prev, other_type_text: true }))}
              />
              {touched.other_type_text && errors.other_type_text && <div className="error live-error">{errors.other_type_text}</div>}
            </>
          )}
          {touched.type_of_incident && errors.type_of_incident && <div className="error live-error">{errors.type_of_incident}</div>}
        </div>

        <div className="row row-grid-2">
          <div>
            <label>2. Date of Report <span className="required">*</span></label>
            <input 
              type="date" 
              value={form.date_of_report} 
              onChange={e => update("date_of_report", e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, date_of_report: true }))}
              className={touched.date_of_report && errors.date_of_report ? 'error-border' : ''}
            />
            {touched.date_of_report && errors.date_of_report && <div className="error live-error">{errors.date_of_report}</div>}
          </div>
          <div>
            <label>3. Time of Report (HH:MM) <span className="required">*</span></label>
            <input 
              type="time" 
              value={form.time_of_report} 
              onChange={e => update("time_of_report", e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, time_of_report: true }))}
              className={touched.time_of_report && errors.time_of_report ? 'error-border' : ''}
            />
            {touched.time_of_report && errors.time_of_report && <div className="error live-error">{errors.time_of_report}</div>}
          </div>
        </div>

        <div className="row row-grid-2">
          <div>
            <label>4. Name of Impacted Employee / Person <span className="required">*</span></label>
            <input 
              value={form.impacted_name} 
              onChange={e => handleFieldChange("impacted_name", e.target.value, (val) => 
                !val ? { isValid: false, message: "Impacted name is required" } : { isValid: true, message: "" }
              )}
              onBlur={() => setTouched(prev => ({ ...prev, impacted_name: true }))}
              className={touched.impacted_name && errors.impacted_name ? 'error-border' : ''}
            />
            {touched.impacted_name && errors.impacted_name && <div className="error live-error">{errors.impacted_name}</div>}
          </div>
          <div>
            <label>5. Employee ID of Impacted Employee <span className="required">*</span></label>
            <input 
              value={form.impacted_employee_id} 
              onChange={e => handleFieldChange("impacted_employee_id", e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, impacted_employee_id: true }))}
              className={touched.impacted_employee_id && errors.impacted_employee_id ? 'error-border' : ''}
              placeholder="Enter employee ID"
            />
            {touched.impacted_employee_id && errors.impacted_employee_id && <div className="error live-error">{errors.impacted_employee_id}</div>}
          </div>
        </div>

        <div className="row">
          <label>6. Was this incident reported verbally before submitting this report? <span className="required">*</span></label>
          <div className="radio-row">
            <label>
              <input 
                type="radio" 
                name="reported" 
                checked={form.was_reported_verbally === true} 
                onChange={() => {
                  update("was_reported_verbally", true);
                  setTouched(prev => ({ ...prev, was_reported_verbally: true }));
                  const newErrors = { ...errors };
                  delete newErrors['was_reported_verbally'];
                  setErrors(newErrors);
                }}
              /> Yes
            </label>
            <label>
              <input 
                type="radio" 
                name="reported" 
                checked={form.was_reported_verbally === false} 
                onChange={() => {
                  update("was_reported_verbally", false);
                  setTouched(prev => ({ ...prev, was_reported_verbally: true }));
                  const newErrors = { ...errors };
                  delete newErrors['was_reported_verbally'];
                  setErrors(newErrors);
                }}
              /> No
            </label>
          </div>
          {touched.was_reported_verbally && errors.was_reported_verbally && <div className="error live-error">{errors.was_reported_verbally}</div>}
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
                    onChange={e => {
                      update("incident_reported_to", [e.target.value]);
                      setTouched(prev => ({ ...prev, incident_reported_to: true }));
                      if (e.target.value) {
                        const newErrors = { ...errors };
                        delete newErrors['incident_reported_to'];
                        setErrors(newErrors);
                      }
                    }}
                    onBlur={() => setTouched(prev => ({ ...prev, incident_reported_to: true }))}
                    className={touched.incident_reported_to && errors.incident_reported_to ? 'error-border' : ''}
                  >
                    <option value="">-- select --</option>
                    {REPORTED_TO_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {touched.incident_reported_to && errors.incident_reported_to && <div className="error live-error">{errors.incident_reported_to}</div>}
                </div>

                <div className="row">
                  <label>8. If Yes, to whom (Name and Department): <span className="required">*</span></label>
                  <input 
                    value={form.reported_to_details} 
                    onChange={e => handleFieldChange("reported_to_details", e.target.value, (val) => 
                      !val?.trim() ? { isValid: false, message: "Provide name & department" } : { isValid: true, message: "" }
                    )}
                    onBlur={() => setTouched(prev => ({ ...prev, reported_to_details: true }))}
                    className={touched.reported_to_details && errors.reported_to_details ? 'error-border' : ''}
                    placeholder="Name and Department"
                  />
                  {touched.reported_to_details && errors.reported_to_details && <div className="error live-error">{errors.reported_to_details}</div>}
                </div>
              </>
            )}

            {/* Q9–Q21 appear normally */}
            <div className="row">
              <label>9. Location of Incident or Accident (Specify Office / Branch) <span className="required">*</span></label>
              <input 
                value={form.location} 
                onChange={e => handleFieldChange("location", e.target.value, (val) => 
                  !val?.trim() ? { isValid: false, message: "Location is required" } : { isValid: true, message: "" }
                )}
                onBlur={() => setTouched(prev => ({ ...prev, location: true }))}
                className={touched.location && errors.location ? 'error-border' : ''}
              />
              {touched.location && errors.location && <div className="error live-error">{errors.location}</div>}
            </div>

            <div className="row row-grid-3">
              <div>
                <label>10. Reported By - Name <span className="required">*</span></label>
                <input 
                  value={form.reported_by_name} 
                  onChange={e => handleFieldChange("reported_by_name", e.target.value, (val) => 
                    !val ? { isValid: false, message: "Reporter name required" } : { isValid: true, message: "" }
                  )}
                  onBlur={() => setTouched(prev => ({ ...prev, reported_by_name: true }))}
                  className={touched.reported_by_name && errors.reported_by_name ? 'error-border' : ''}
                />
                {touched.reported_by_name && errors.reported_by_name && <div className="error live-error">{errors.reported_by_name}</div>}
              </div>
              <div>
                <label>11. Reported By - Employee ID <span className="required">*</span></label>
                <input 
                  value={form.reported_by_employee_id} 
                  onChange={e => handleFieldChange("reported_by_employee_id", e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, reported_by_employee_id: true }))}
                  className={touched.reported_by_employee_id && errors.reported_by_employee_id ? 'error-border' : ''}
                  placeholder="Enter employee ID"
                />
                {touched.reported_by_employee_id && errors.reported_by_employee_id && <div className="error live-error">{errors.reported_by_employee_id}</div>}
              </div>
              <div>
                <label>12. Reported By - Email <span className="required">*</span></label>
                <input 
                  value={form.reported_by_email} 
                  onChange={e => handleFieldChange("reported_by_email", e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, reported_by_email: true }))}
                  className={touched.reported_by_email && errors.reported_by_email ? 'error-border' : ''}
                  placeholder="example@domain.com"
                />
                {touched.reported_by_email && errors.reported_by_email && <div className="error live-error">{errors.reported_by_email}</div>}
              </div>
            </div>

            <div className="row">
              <label>12b. Reported By - Contact Number <span className="required">*</span></label>
              <input 
                value={form.reported_by_contact} 
                onChange={e => handleFieldChange("reported_by_contact", e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, reported_by_contact: true }))}
                className={touched.reported_by_contact && errors.reported_by_contact ? 'error-border' : ''}
                placeholder="+1234567890 or 1234567890"
              />
              {touched.reported_by_contact && errors.reported_by_contact && <div className="error live-error">{errors.reported_by_contact}</div>}
              <div className="muted small">Format: +[country code][number] or just numbers. Min 6, max 15 digits.</div>
            </div>

            <div className="row row-grid-2">
              <div>
                <label>13. Date of Incident Occurred <span className="required">*</span></label>
                <input 
                  type="date" 
                  value={form.date_of_incident} 
                  onChange={e => update("date_of_incident", e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, date_of_incident: true }))}
                  className={touched.date_of_incident && errors.date_of_incident ? 'error-border' : ''}
                />
                {touched.date_of_incident && errors.date_of_incident && <div className="error live-error">{errors.date_of_incident}</div>}
              </div>
              <div>
                <label>14. Time of Incident <span className="required">*</span></label>
                <input 
                  type="time" 
                  value={form.time_of_incident} 
                  onChange={e => update("time_of_incident", e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, time_of_incident: true }))}
                  className={touched.time_of_incident && errors.time_of_incident ? 'error-border' : ''}
                />
                {touched.time_of_incident && errors.time_of_incident && <div className="error live-error">{errors.time_of_incident}</div>}
              </div>
            </div>

            <div className="row">
              <label>15. Detailed Description of Incident <span className="required">*</span></label>
              <textarea 
                value={form.detailed_description} 
                onChange={e => handleFieldChange("detailed_description", e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, detailed_description: true }))}
                rows={5} 
                className={touched.detailed_description && errors.detailed_description ? 'error-border' : ''}
              />
              {touched.detailed_description && errors.detailed_description && <div className="error live-error">{errors.detailed_description}</div>}
            </div>

            <div className="row">
              <label>16. Immediate Actions Taken <span className="required">*</span></label>
              <textarea 
                value={form.immediate_actions_taken} 
                onChange={e => handleFieldChange("immediate_actions_taken", e.target.value, (val) => 
                  !val?.trim() ? { isValid: false, message: "Immediate actions are required" } : { isValid: true, message: "" }
                )}
                onBlur={() => setTouched(prev => ({ ...prev, immediate_actions_taken: true }))}
                rows={3} 
                className={touched.immediate_actions_taken && errors.immediate_actions_taken ? 'error-border' : ''}
              />
              {touched.immediate_actions_taken && errors.immediate_actions_taken && <div className="error live-error">{errors.immediate_actions_taken}</div>}
            </div>

            <div className="row">
              <label>17. Accompanying Person Name and Contact Details</label>
              {(form.accompanying_person || []).map((p, i) => (
                <div key={i} className="accompany-row">
                  <input placeholder="Name" value={p.name} onChange={e => setAccompany(i, "name", e.target.value)} />
                  <input 
                    placeholder="Contact" 
                    value={p.contact} 
                    onChange={e => setAccompany(i, "contact", e.target.value)}
                    onBlur={(e) => {
                      const validation = validatePhoneNumber(e.target.value);
                      if (!validation.isValid && e.target.value) {
                        alert(`Accompanying person ${i + 1}: ${validation.message}`);
                      }
                    }}
                  />
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
                  <input 
                    placeholder="Contact" 
                    value={(form.witness_contacts || [])[i] || ""} 
                    onChange={e => setWitnessContact(i, e.target.value)}
                    onBlur={(e) => {
                      const validation = validatePhoneNumber(e.target.value);
                      if (!validation.isValid && e.target.value) {
                        alert(`Witness ${i + 1}: ${validation.message}`);
                      }
                    }}
                  />
                  <button type="button" className="btn small" onClick={() => removeWitness(i)}>Remove</button>
                </div>
              ))}
              <button type="button" className="btn" onClick={addWitness}>Add Witness</button>
              {errors.witness_contacts && <div className="error live-error">{errors.witness_contacts}</div>}
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




...
/* Add these to your existing IncidentForm.css file */

/* Error border for invalid fields */
.error-border {
  border: 2px solid #dc3545 !important;
  background-color: #fff8f8 !important;
}

/* Success border for valid fields (optional) */
.success-border {
  border: 2px solid #28a745 !important;
}

/* Live error messages */
.live-error {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 4px;
  padding: 4px 8px;
  background-color: #fff8f8;
  border-radius: 4px;
  border-left: 3px solid #dc3545;
  animation: fadeIn 0.3s ease-in;
}

/* For required fields that are not filled yet */
.pending-validation {
  border: 2px solid #ffc107 !important;
}

/* Helper text */
.muted.small {
  font-size: 0.8rem;
  margin-top: 4px;
  color: #6c757d;
}

/* Animation for error messages */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Focus state for validated fields */
input:focus.error-border,
textarea:focus.error-border,
select:focus.error-border {
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
}

input:focus.success-border,
textarea:focus.success-border,
select:focus.success-border {
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25) !important;
}

/* Real-time validation indicator */
.validation-indicator {
  display: inline-block;
  margin-left: 8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.validation-indicator.valid {
  background-color: #28a745;
}

.validation-indicator.invalid {
  background-color: #dc3545;
}

.validation-indicator.pending {
  background-color: #ffc107;
}