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