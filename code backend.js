import React, { useState, useEffect } from "react";
import "./IncidentForm.css";

const initialForm = {
  impacted_employee_id: "",
  impacted_employee_fname: "",
  impacted_employee_lname: "",
  reported_by_employee_id: "",
  reported_by_fname: "",
  reported_by_lname: "",
  reported_by_contact: "",
  reported_by_email: "",
  reported_by_gender: "",
  type_of_incident: "",
  incident_date: "",
  incident_time: "",
  incident_location: "",
  incident_description: "",
  treatment_recieved: "",
  treatment_details: "",
  treatment_date: "",
  witnesses: [""],
  accompanying: [""],
  form: "",
  form_description: "",
  showAfterSix: "No",
  why_not_reported: "",
  documents: []
};

// Field validation function
const validateField = (name, value) => {
  switch (name) {
    case "impacted_employee_id":
    case "reported_by_employee_id":
      if (!value) return "Employee ID is required.";
      if (!/^[A-Za-z0-9\-_.]{1,20}$/.test(value))
        return "Employee ID must be alphanumeric.";
      return "";

    case "reported_by_contact":
      if (!value) return "Contact number is required.";
      if (!/^[+\d][\d\s\-().]{5,}$/.test(value))
        return "Invalid contact number.";
      return "";

    case "reported_by_email":
      if (!value) return "Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Invalid email format.";
      return "";

    case "type_of_incident":
      if (!value) return "Type of incident is required.";
      return "";

    default:
      return "";
  }
};

export default function IncidentForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  // Load saved draft
  useEffect(() => {
    const saved = localStorage.getItem("incidentFormDraft");
    if (saved) setForm(JSON.parse(saved));
  }, []);

  // Auto-save draft
  useEffect(() => {
    localStorage.setItem("incidentFormDraft", JSON.stringify(form));
  }, [form]);

  // Update & validate field
  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  };

  // Update dynamic lists (witnesses / accompanying)
  const updateList = (listName, idx, value) => {
    const newList = [...form[listName]];
    newList[idx] = value;
    setForm((prev) => ({ ...prev, [listName]: newList }));
  };

  const addListItem = (listName) => {
    setForm((prev) => ({ ...prev, [listName]: [...prev[listName], ""] }));
  };

  const removeListItem = (listName, idx) => {
    const newList = [...form[listName]];
    newList.splice(idx, 1);
    setForm((prev) => ({ ...prev, [listName]: newList }));
  };

  // File uploads
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, documents: [...prev.documents, ...files] }));
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    let validationErrors = {};
    Object.keys(form).forEach((key) => {
      const err = validateField(key, form[key]);
      if (err) validationErrors[key] = err;
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    alert("Incident Report Submitted Successfully!");
  };

  return (
    <div className="incident-container">
      <h2 className="title">HR Incident Report Form</h2>

      <form onSubmit={handleSubmit} className="incident-form">

        {/* Impacted Employee */}
        <div className="section-card">
          <h3>Impacted Employee</h3>

          <div className="grid-3">
            <div className="field">
              <label>Employee ID</label>
              <input
                type="text"
                value={form.impacted_employee_id}
                onChange={(e) =>
                  update("impacted_employee_id", e.target.value.replace(/[^A-Za-z0-9\-_.]/g, ""))
                }
              />
              {errors.impacted_employee_id && (
                <p className="error">{errors.impacted_employee_id}</p>
              )}
            </div>

            <div className="field">
              <label>First Name</label>
              <input
                type="text"
                value={form.impacted_employee_fname}
                onChange={(e) => update("impacted_employee_fname", e.target.value)}
              />
            </div>

            <div className="field">
              <label>Last Name</label>
              <input
                type="text"
                value={form.impacted_employee_lname}
                onChange={(e) => update("impacted_employee_lname", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Reported By */}
        <div className="section-card">
          <h3>Reported By</h3>

          <div className="grid-3">
            <div className="field">
              <label>Employee ID</label>
              <input
                type="text"
                value={form.reported_by_employee_id}
                onChange={(e) =>
                  update("reported_by_employee_id", e.target.value.replace(/[^A-Za-z0-9\-_.]/g, ""))
                }
              />
              {errors.reported_by_employee_id && (
                <p className="error">{errors.reported_by_employee_id}</p>
              )}
            </div>

            <div className="field">
              <label>First Name</label>
              <input
                type="text"
                value={form.reported_by_fname}
                onChange={(e) => update("reported_by_fname", e.target.value)}
              />
            </div>

            <div className="field">
              <label>Last Name</label>
              <input
                type="text"
                value={form.reported_by_lname}
                onChange={(e) => update("reported_by_lname", e.target.value)}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="field">
              <label>Contact Number</label>
              <input
                type="text"
                value={form.reported_by_contact}
                onChange={(e) =>
                  update("reported_by_contact", e.target.value.replace(/[^0-9+]/g, ""))
                }
              />
              {errors.reported_by_contact && (
                <p className="error">{errors.reported_by_contact}</p>
              )}
            </div>

            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={form.reported_by_email}
                onChange={(e) => update("reported_by_email", e.target.value)}
              />
              {errors.reported_by_email && (
                <p className="error">{errors.reported_by_email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Incident Details */}
        <div className="section-card">
          <h3>Incident Details</h3>

          <div className="grid-2">
            <div className="field">
              <label>Type of Incident</label>
              <select
                value={form.type_of_incident}
                onChange={(e) => update("type_of_incident", e.target.value)}
              >
                <option value="">Select</option>
                <option>Harassment</option>
                <option>Discrimination</option>
                <option>Violence</option>
                <option>Safety Issue</option>
                <option>Other</option>
              </select>
              {errors.type_of_incident && (
                <p className="error">{errors.type_of_incident}</p>
              )}
            </div>

            <div className="field">
              <label>Location</label>
              <input
                type="text"
                value={form.incident_location}
                onChange={(e) => update("incident_location", e.target.value)}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="field">
              <label>Date</label>
              <input
                type="date"
                value={form.incident_date}
                onChange={(e) => update("incident_date", e.target.value)}
              />
            </div>

            <div className="field">
              <label>Time</label>
              <input
                type="time"
                value={form.incident_time}
                onChange={(e) => update("incident_time", e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label>Description</label>
            <textarea
              rows={4}
              value={form.incident_description}
              onChange={(e) => update("incident_description", e.target.value)}
            />
          </div>
        </div>

        {/* File Upload */}
        <div className="section-card">
          <h3>Upload Evidence</h3>

          <input type="file" multiple onChange={handleFileUpload} />

          <div className="file-preview">
            {form.documents.map((file, i) => (
              <p key={i}>{file.name}</p>
            ))}
          </div>
        </div>

        {/* Reporting Time */}
        <div className="section-card">
          <h3>Reporting Time</h3>

          <label>Was the incident reported after 6 hours?</label>
          <select
            value={form.showAfterSix}
            onChange={(e) => update("showAfterSix", e.target.value)}
          >
            <option>No</option>
            <option>Yes</option>
          </select>

          {form.showAfterSix === "Yes" && (
            <div className="field">
              <label>Why was the report delayed?</label>
              <textarea
                rows="3"
                value={form.why_not_reported}
                onChange={(e) => update("why_not_reported", e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Witnesses */}
        <div className="section-card">
          <h3>Witnesses</h3>

          {form.witnesses.map((w, i) => (
            <div key={i} className="dynamic-row">
              <input
                type="text"
                value={w}
                onChange={(e) => updateList("witnesses", i, e.target.value)}
              />
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => removeListItem("witnesses", i)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={() => addListItem("witnesses")}>
            + Add Witness
          </button>
        </div>

        <button className="submit-btn" type="submit">
          Submit Incident Report
        </button>
      </form>
    </div>
  );
}