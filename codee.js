{showCardsPopup && (
  <td className="popup-td" colSpan="2">
    <div className="popup-card fancy-popup">
      <div className="popup-header">
        <strong>Card Details</strong>
        <button
          className="popup-close fancy-close"
          onClick={() => setShowCardsPopup(false)}
          title="Close"
        >
          🕓
        </button>
      </div>

      <div className="popup-body">
        <div><strong>Total Cards:</strong> {emp.Total_Cards ?? 0}</div>
        <div><strong>Active Cards:</strong> {emp.Active_Cards ?? 0}</div>
        <div><strong>Deactive Cards:</strong> {emp.Deactive_Cards ?? 0}</div>

        <div style={{ marginTop: 10 }}>
          <strong>Active Card Numbers</strong>
          <ul className="popup-list">
            {toList(emp.Active_Card_Numbers).length === 0 && (<li>—</li>)}
            {toList(emp.Active_Card_Numbers).map((c, i) => <li key={`ac-${i}`}>{c}</li>)}
          </ul>
        </div>

        <div style={{ marginTop: 10 }}>
          <strong>Deactive Card Numbers</strong>
          <ul className="popup-list">
            {toList(emp.Deactive_Card_Numbers).length === 0 && (<li>—</li>)}
            {toList(emp.Deactive_Card_Numbers).map((c, i) => <li key={`dc-${i}`}>{c}</li>)}
          </ul>
        </div>
      </div>
    </div>
  </td>
)}