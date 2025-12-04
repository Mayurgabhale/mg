/* MODAL */
.modal {
  display:none;
  position:fixed;
  inset:0;
  background:rgba(0,0,0,0.4);
  padding:40px;
  z-index:1000;
}
.modal-content {
  background:#fff;
  padding:20px;
  max-width:700px;
  margin:auto;
  border-radius:6px;
}

/* FORM GRID */
.form-grid {
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:12px;
}
.form-grid label {
  display:flex;
  flex-direction:column;
  font-size:14px;
}
.full {
  grid-column:1 / -1;
}

.req {
  color:red;
}

/* DOOR/READER TABLE */
.dr-table {
  width:100%;
  border-collapse:collapse;
  margin-bottom:8px;
}
.dr-table th, .dr-table td {
  border:1px solid #ccc;
  padding:6px;
}
.dr-table input {
  width:95%;
}

/* BUTTONS */
.add-btn {
  padding:6px 12px;
  background:#007bff;
  color:white;
  border:none;
  cursor:pointer;
}
.add-btn:hover {
  opacity:0.8;
}

.modal-footer {
  display:flex;
  justify-content:space-between;
  margin-top:20px;
}