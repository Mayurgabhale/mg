{showCardsPopup && (
  <div className="popup-overlay" onClick={() => setShowCardsPopup(false)}>
    <div
      className="popup-card fancy-popup"
      onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
    >
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
  </div>
)}










/* Centered overlay for popups */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(3px);
}

/* Centered fancy popup */
.fancy-popup {
  position: relative;
  background: #1c1c24;
  color: #fff;
  border-radius: 16px;
  padding: 20px;
  min-width: 320px;
  max-width: 480px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  animation: popupFadeInCenter 0.3s ease-out;
  z-index: 9999;
}

/* smooth fade + scale animation */
@keyframes popupFadeInCenter {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}