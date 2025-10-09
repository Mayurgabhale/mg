i  want pop up  in center ok 

///////  pop up  */
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










// frontend/src/components/EmployeeCard.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaIdBadge, FaUserTie, FaIdCard, FaCheckCircle, FaClone, FaMapMarkerAlt } from 'react-icons/fa';
import CurrentLocation from './CurrentLocation';
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import './EmployeeCard.css';

export default function EmployeeCard({ emp }) {
  // ---- Hooks: MUST be called unconditionally ----
  const [showMore, setShowMore] = useState(false);
  const [showCardsPopup, setShowCardsPopup] = useState(false);
  const [showClearancePopup, setShowClearancePopup] = useState(false);
  const cardsRef = useRef(null);
  const clearanceRef = useRef(null);

  // close popups on outside click (unconditional hook)
  useEffect(() => {
    function handleDocClick(e) {
      if (showCardsPopup && cardsRef.current && !cardsRef.current.contains(e.target)) {
        setShowCardsPopup(false);
      }
      if (showClearancePopup && clearanceRef.current && !clearanceRef.current.contains(e.target)) {
        setShowClearancePopup(false);
      }
    }
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, [showCardsPopup, showClearancePopup]);

  // helper to convert comma string -> array
  const toList = (csv) => {
    if (!csv) return [];
    return csv.split(',').map(s => s.trim()).filter(Boolean);
  };

  // Early return AFTER hooks (so hooks are always called in same order)
  if (!emp) return null;

  const rawStatus = emp.Employee_Status || 'Deactive';
  const normalizedStatus = rawStatus.trim().toLowerCase();
  const isRedStatus =
    normalizedStatus === 'deactive' || normalizedStatus === 'terminated';

  return (
    <div
      className="employee-card-container"
      data-status={normalizedStatus}
      style={{
        background: isRedStatus
          ? '#f55847'
          : 'linear-gradient(180deg, #131318 0%, #1d1d26 100%)',
      }}
    >
      {/* Left column */}
      <div className="left-col">
        <div className="photo-ring">
          <img
            className="photo"
            src={emp.imageUrl ? `http://localhost:5001${emp.imageUrl}` : '/images/no-photo.jpg'}
            alt={emp.EmpName || 'Employee photo'}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/no-photo.jpg';
            }}
          />
        </div>

        <div className="photo-meta">
          <div className="emp-name">{emp.EmpName || '—'}</div>
          <div className="emp-role">{emp.PersonnelType || 'Employee'}</div>
          <div className={`status-pill ${normalizedStatus}`}>{rawStatus}</div>
        </div>
      </div>

      {/* Separator */}
      <div className="separator" aria-hidden />

      {/* Right column */}
      <div className="right-col">
        <h3 className="profile-title">Profile Details</h3>

        <table className="details-table" aria-label="employee details">
          <tbody>
            {/* Always visible */}
            <tr>
              <td className="label "><FaUser color='#FFDD00' /> Name</td>
              <td className="value v-color">{emp.EmpName || '—'}</td>
            </tr>
            <tr>
              <td className="label"><FaIdBadge color='#FFDD00' /> Employee ID</td>
              <td className="value v-color">{emp.EmployeeID || '—'}</td>
            </tr>
            <tr>
              <td className="label"><FaUserTie color='#FFDD00' /> Manager</td>
              <td className="value v-color">{emp.Manager_Name || '—'}</td>
            </tr>

            {/* Active Cards: displays Total_Cards (requested) */}
            <tr
              className="clickable-row"
              ref={cardsRef}
            >
              <td className="label"><FaIdCard /> Active Cards</td>
              <td
                className="value v-color clickable-cell"
                onClick={(e) => { e.stopPropagation(); setShowCardsPopup(prev => !prev); }}
                title="Click to view card details"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setShowCardsPopup(prev => !prev); } }}
              >
                {emp.Total_Cards ?? 0}
              </td>

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
            </tr>

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

            <tr>
              <td className="label"><HiOutlineBuildingOffice2 color='#FFDD00' /> Company Name</td>
              <td className="value v-color">{emp.CompanyName || '—'}</td>
            </tr>
            <tr>
              <td className="label"><FaMapMarkerAlt color='#FFDD00' /> Primary Location</td>
              <td className="value v-color">{emp.PrimaryLocation || '—'}</td>
            </tr>

            <tr>
              <td colSpan="2" style={{ paddingTop: 1 }}>
                <CurrentLocation empId={emp.id ?? emp.EmployeeID} showMore={showMore} />
              </td>
            </tr>

            {/* Hidden until showMore is true */}
            {showMore && (
              <>
                <tr>
                  <td className="label"><FaClone /> Total Cards</td>
                  <td className="value">{emp.Total_Cards ?? 0}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>

        {/* Toggle Button */}
        <button
          className="show-more-btn"
          onClick={() => setShowMore((prev) => !prev)}
        >
          {showMore ? 'Show Less' : 'Show More'}
        </button>
      </div>
    </div>
  );
}


























