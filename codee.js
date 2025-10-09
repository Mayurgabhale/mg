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
        {emp.Clearances && emp.Clearances.split(',').map((c, i) => <li key={`clr-${i}`}>{c.trim()}</li>)}
      </ul>
    </div>
  </div>
</div>