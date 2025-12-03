/* IncidentForm.css - simple, clean styles */
.incident-card {
  background: #fff;
  border-radius: 8px;
  padding: 18px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
  max-width: 980px;
  margin: 0 auto;
  color: #111;
  font-family: Inter, Arial, sans-serif;
}

.incident-header h2 { margin: 0 0 6px 0; }
.muted { color: #666; font-size: 0.9rem; margin-top: 4px; }

.incident-form .row { margin: 12px 0; }
.incident-form label { display:block; font-weight:600; margin-bottom:6px; }
.incident-form input[type="text"],
.incident-form input[type="date"],
.incident-form input[type="time"],
.incident-form input[type="email"],
.incident-form select,
.incident-form textarea {
  width:100%;
  padding:8px 10px;
  border:1px solid #d1d5db;
  border-radius:6px;
  font-size:0.95rem;
  box-sizing: border-box;
}

.row-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.row-grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; }

.radio-row { display:flex; gap: 12px; align-items:center; }
.checkbox-grid { display:flex; gap:12px; flex-wrap:wrap; }
.accompany-row { display:flex; gap:8px; align-items:center; margin-bottom:8px; }
.accompany-row input { flex:1; }

.file-list { margin-top:8px; }
.file-item { display:flex; gap:10px; align-items:center; padding:6px 8px; border-radius:6px; background:#f3f4f6; margin-bottom:6px; }

.form-actions { display:flex; gap:12px; align-items:center; margin-top:16px; flex-wrap:wrap; }
.btn { padding:8px 12px; border-radius:6px; border:1px solid #cbd5e1; background:#fff; cursor:pointer; }
.btn.small { padding:4px 8px; font-size:0.85rem; }
.btn.primary { background:#0ea5a4; color:#fff; border:none; }
.btn.outline { background:#fff; border:1px solid #cbd5e1; }
.required { color:#b91c1c; margin-left:6px; }

.error { color:#b91c1c; margin-top:6px; font-size:0.9rem; }
.mt8 { margin-top:8px; }