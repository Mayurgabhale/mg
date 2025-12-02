.incident-card {
  background: #fff;
  border-radius: 8px;
  padding: 18px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  margin: 12px 0;
}
.incident-card h2 { margin-top: 0; }
.incident-form .row { margin-bottom: 12px; display:block; }
.incident-form label { font-weight: 600; display:block; margin-bottom:6px; }
.incident-form input[type="text"],
.incident-form input[type="date"],
.incident-form input[type="time"],
.incident-form input[type="tel"],
.incident-form select,
.incident-form textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  box-sizing: border-box;
}
.incident-form textarea { min-height: 80px; }
.form-actions { display:flex; gap:10px; align-items:center; margin-top:10px; }
.btn { padding:8px 10px; border-radius:6px; border: none; background:#007bff; color:white; cursor:pointer; }
.btn.outline { background:transparent; border:1px solid #ccc; color:#333; }
.btn.small { padding:6px 8px; font-size:13px; }
.btn.primary { background:#0b74de; }
.muted { color:#666; font-size:13px; margin-top:6px; }
.error { color:#b00020; font-size:13px; margin-top:6px; }

.checkbox-grid label { display:inline-block; margin-right:10px; margin-bottom:6px; }
.radio-row label { margin-right:14px; }

.accompany-row { display:flex; gap:8px; margin-bottom:8px; }
.accompany-row input { flex:1; }

.incident-list { margin-top:12px; }
.list-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
.inc-table { width:100%; border-collapse: collapse; }
.inc-table th, .inc-table td { border-bottom:1px solid #eee; padding:8px; text-align:left; }

.modal { position:fixed; inset:0; background:rgba(0,0,0,0.45); display:flex; justify-content:center; align-items:center; z-index:1000; }
.modal-inner { background:#fff; padding:18px; border-radius:8px; width:90%; max-width:900px; max-height:80vh; overflow:auto; position:relative; }
.modal-close { position:absolute; right:10px; top:10px; }
.detail-json { background:#f7f7f7; padding:10px; border-radius:6px; font-family:monospace; white-space:pre-wrap; }