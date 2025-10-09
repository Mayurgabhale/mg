{/* Clearance row: shows ClearanceCount and clickable to open details */}
<tr
  className="clickable-row"
  ref={clearanceRef}
>
  <td className="label"><FaCheckCircle color='#FFDD00' /> Clearance</td>
  <td
    className="value v-color clickable-cell"
    onClick={(e) => { e.stopPropagation(); setShowClearancePopup(prev => !prev); }}
    title="Click to view clearance details"
    role="button"
    tabIndex={0}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setShowClearancePopup(prev => !prev); } }}
  >
    {emp.ClearanceCount ?? 0}
  </td>

  {showClearancePopup && (
    <td className="popup-td" colSpan="2">
      <div className="popup-card fancy-popup">
        <div className="popup-header">
          <strong>Clearance Details</strong>
          <button
            className="popup-close fancy-close"
            onClick={() => setShowClearancePopup(false)}
            title="Close"
          >
            🕓
          </button>
        </div>

        <div className="popup-body">
          <div><strong>Clearance Count:</strong> {emp.ClearanceCount ?? 0}</div>
          <div style={{ marginTop: 8 }}>
            <strong>Clearances</strong>
            <ul className="popup-list">
              {(!emp.Clearances || emp.Clearances.trim() === '') && <li>—</li>}
              {emp.Clearances && emp.Clearances.split(',').map((c, i) => (
                <li key={`clr-${i}`}>{c.trim()}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </td>
  )}
</tr>






/* clickable */
.clickable-cell { cursor: pointer; }

/* popup wrapper cell */
.popup-td {
  position: relative;
  vertical-align: top;
  padding: 0;
}

/* ✅ Fancy popup container */
.fancy-popup {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #1c1c24;
  color: #fff;
  border-radius: 16px;
  padding: 16px;
  min-width: 280px;
  max-width: 420px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  animation: popupFadeIn 0.25s ease-out;
  transform-origin: top right;
  z-index: 9999;
  box-sizing: border-box;
}

/* animation */
@keyframes popupFadeIn {
  from { opacity: 0; transform: scale(0.8) translateY(-10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

/* header */
.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(255, 221, 0, 0.3);
  padding-bottom: 6px;
}

/* close button */
.fancy-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #ffdd00;
  background: transparent;
  color: #ffdd00;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
}
.fancy-close:hover {
  background: #ffdd00;
  color: #1c1c24;
  transform: rotate(90deg);
}

/* body */
.popup-body {
  font-size: 14px;
  line-height: 1.5;
}
.popup-list {
  margin: 5px 0 0 15px;
  padding: 0;
  list-style: disc;
}
.popup-list li {
  margin-bottom: 3px;
}

/* allow popup overflow */
.details-table, .details-table tr, .details-table td {
  overflow: visible;
}

/* small screens */
@media (max-width: 520px) {
  .fancy-popup {
    position: fixed;
    left: 16px;
    right: 16px;
    bottom: 16px;
    top: auto;
    width: calc(100% - 32px);
    max-width: none;
  }
}