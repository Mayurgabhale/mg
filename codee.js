Last swipe: — at No data
not show 
read below all code and chekc why last swip i not disply.
  read below file eace line carefully... 
  and diplsy the last swipe ok 
Profile Details
 Name	Satpute, Sejal
 Employee ID	W0019059
 Manager	Lloyds Dass
 Total Cards	2
 Clearance	2
 Company Name	Poona Security India Pvt.Ltd
 Primary Location	Pune - Business Bay
Swipe Details
Out of Office
Last swipe: — at No data

http://10.199.22.57:3008/api/occupancy/live-summary
  "details": [
    {
      "ObjectName1": "Unavane, Aditya",
      "Door": "APAC_IN_PUN_PODIUM_RED_RECREATION AREA FIRE EXIT 1-DOOR NEW",
      "PersonnelType": "Employee",
      "EmployeeID": "328923",
      "CardNumber": "620146",
      "PartitionName2": "Pune",
      "LocaleMessageTime": "2025-11-21T12:05:12.000Z",
      "Direction": "InDirection",
      "PersonGUID": "F4980CD9-374E-4408-BD7B-001F7D12F8AD",
      "CompanyName": "WU Srvcs India Private Ltd",
      "PrimaryLocation": "Pune - Business Bay",
      "Zone": "Red Zone",
      "Floor": "Podium Floor"
    },

    // controllers/employeeLocationController.js
const axios = require('axios');
const sql = require('mssql');
const { getPool } = require('../config/db');

const OCCUPANCY_URLS = [
  'http://10.199.22.57:3006/api/occupancy/live-summary',

  'http://10.199.22.57:3007/api/occupancy/live-summary',  // EMEA


  'http://10.199.22.57:3008/api/occupancy/live-summary',  //Pune


  'http://10.199.22.57:4000/api/occupancy/live-summary'   //laca

];

// Simple in-memory cache: { [employeeObjId]: { ts: Number, data: Object } }
const cache = {};
const CACHE_TTL_MS = 50000; // 5 seconds — tune as needed

function normalizeString(s) {
  if (!s && s !== 0) return '';
  return String(s).trim().toLowerCase();
}

function parseRecordTime(rec) {
  // Priority: LocaleMessageTime -> snapshotTime -> Dateonly + Swipe_Time
  if (rec.LocaleMessageTime) return new Date(rec.LocaleMessageTime);
  if (rec.snapshotTime) return new Date(rec.snapshotTime);
  if (rec.Dateonly && rec.Swipe_Time) {
    // e.g. "2025-08-11" + "00:02:41"
    return new Date(`${rec.Dateonly}T${rec.Swipe_Time}Z`);
  }
  return null;
}

async function getEmployeeLiveLocation(req, res) {
  const employeeObjId = req.params.id;
  if (!employeeObjId) return res.status(400).json({ error: 'Missing id' });



  try {
    // 1) Fetch EmployeeID and Name from DB (same logic as getEmployees)
    const pool = await getPool();
    const empResult = await pool.request()
      .input('objid', sql.BigInt, employeeObjId)
      .query(`
        SELECT AP.ObjectID,
               AP.Name AS EmpName,
               AP.Int1,
               AP.Text12
        FROM ACVSCore.Access.Personnel AP
        WHERE AP.ObjectID = @objid
      `);

    if (!empResult.recordset.length) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const empRow = empResult.recordset[0];
    // EmployeeID logic mirroring existing query:
    const EmployeeID = (empRow.Int1 === 0 || empRow.Int1 === '0' || empRow.Int1 === null)
      ? (empRow.Text12 ? String(empRow.Text12) : '')
      : String(empRow.Int1);

    const empName = empRow.EmpName || '';

    // 2) Query occupancy endpoints concurrently
    // const requests = OCCUPANCY_URLS.map(u => axios.get(u, { timeout: 5000 }).catch(e => ({ error: e, url: u })));
    const requests = OCCUPANCY_URLS.map(u => axios.get(u).catch(e => ({ error: e, url: u })));
    const responses = await Promise.all(requests);

    // 3) Collect and flatten details
    let allDetails = [];
    for (const r of responses) {
      if (!r || r.error) {
        // Log but continue
        console.warn('Occupancy fetch failed for', r && r.url, r && r.error && r.error.message);
        continue;
      }
      if (r.data && Array.isArray(r.data.details)) {
        // Keep source url for debugging
        const src = r.config && r.config.url ? r.config.url : null;
        const annotated = r.data.details.map(d => ({ ...d, __source: src }));
        allDetails.push(...annotated);
      }
    }

    // 4) Find matches by EmployeeID (preferred), fallback to name (ObjectName1), then PersonGUID
    const normEmployeeID = normalizeString(EmployeeID);
    const normEmpName = normalizeString(empName);

    const matches = allDetails.filter(rec => {
      const recEmpId = normalizeString(rec.EmployeeID);
      if (recEmpId && normEmployeeID && recEmpId === normEmployeeID) return true;

      const recName = normalizeString(rec.ObjectName1);
      if (recName && normEmpName && recName === normEmpName) return true;

      if (rec.PersonGUID) {
        // optionally, you can compare GUIDs if you have them
      }
      return false;
    });

    if (!matches.length) {
      const result = { found: false, message: 'No recent swipe found' };
      cache[employeeObjId] = { ts: Date.now(), data: result };
      return res.json(result);
    }

    // 5) Select most recent
    let best = null;
    for (const m of matches) {
      const t = parseRecordTime(m);
      if (!t) continue;
      if (!best) best = { rec: m, time: t };
      else if (t > best.time) best = { rec: m, time: t };
    }

    if (!best) {
      const result = { found: false, message: 'No timestamped swipe found' };
      cache[employeeObjId] = { ts: Date.now(), data: result };
      return res.json(result);
    }

    const r = best.rec;



    const payload = {
      found: true,
      source: r.__source || null,
      partition: r.PartitionName2 || r.Partition || null,
      floor: r.Floor || r.Zone || r.floor || null,
      Zone: r.Zone,
      door: r.Door || null,
      direction: r.Direction || null,
      timestampUTC: r.LocaleMessageTime || r.snapshotTime || `${r.Dateonly}T${r.Swipe_Time}Z` || null,
      personnelType: r.PersonnelType || null,
      cardNumber: r.CardNumber || null,
      raw: r
    };
    cache[employeeObjId] = { ts: Date.now(), data: payload };

    return res.json(payload);

  } catch (err) {
    console.error('getEmployeeLiveLocation error', err && err.stack || err);
    return res.status(500).json({ error: 'Failed to fetch live location', message: err.message });
  }
}

module.exports = { getEmployeeLiveLocation };
C:\Users\W0024618\Desktop\employee-verification\frontend\src\components\CurrentLocation.jsx



// C:\Users\W0024618\Desktop\employee-verification\frontend\src\components\CurrentLocation.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaPalette, FaCalendarAlt, FaClock, FaDoorClosed, FaExchangeAlt } from 'react-icons/fa';
import './EmployeeCard.css';
export default function CurrentLocation({ empId, showMore }) {
  const [loading, setLoading] = useState(false);
  const [loc, setLoc] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!empId) {
      setLoc(null);
      setError('');
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError('');
    setLoc(null);

    axios
      .get(`http://localhost:5001/api/employees/${empId}/location`)
      .then((res) => {
        if (cancelled) return;
        setLoc(res.data);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Location load error', err?.message || err);
        setError('Failed to load location');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [empId]);

  if (!empId) return null;



  const isEmployeeOut = (loc) => {
    if (!loc) return false;

    const dir = loc.direction ? loc.direction.toLowerCase() : '';

    return (
      !loc.found ||
      dir === 'out' ||
      dir === 'exit' ||
      dir === 'egress'
    );
  };


  return (
    <div className="current-location-card" style={{ marginTop: 1 }}>
      <h4 style={{ margin: '0 0 6px 0', fontSize: 14, color: '#f5a742' }}>Swipe Details</h4>

      {loading && <div style={{ color: '#fff' }}>Loading location…</div>}
      {error && <div style={{ color: '#fff' }}>{error}</div>}

      {/* {!loading && loc && !loc.found && (
        <div style={{ color: '#2ced0e' }}>Out office</div>
      )} */}



{!loading && loc && isEmployeeOut(loc) && (
  <div style={{ marginBottom: 6 }}>
    <div style={{ color: '#2ced0e', fontWeight: 'bold' }}>
      Out of Office
    </div>

    <div style={{ color: '#aaa', fontSize: '12px', marginTop: '3px' }}>
      Last swipe: {loc.lastSwipe?.direction || '—'} at{' '}
      {loc.lastSwipe?.timestampUTC
        ? new Date(loc.lastSwipe.timestampUTC).toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })
        : 'No data'}
    </div>
  </div>
)}



      {!loading && loc && loc.found && (
        <table className="swipe-details-table">
          <tbody>
            <tr>
              <td className="label"><FaMapMarkerAlt className="icon location" /> Location</td>
              <td className="value">
                {loc.partition || '—'}
                {loc.floor ? ` · ${loc.floor}` : ''}
              </td>
            </tr>
            <tr>
              <td className="label">
                <FaPalette className="icon zone" /> {loc.Zone ? 'Zone' : 'Floor'}
              </td>
              <td className="value">
                {loc.Zone || loc.floor || '—'}
              </td>
            </tr>
            {showMore && (
              <>
                <tr>
                  <td className="label"><FaCalendarAlt className="icon date" /> Date</td>
                  <td className="value">
                    {loc.timestampUTC
                      ? loc.timestampUTC.split('T')[0] // "2025-08-14"
                      : '—'}
                  </td>
                </tr>

                <tr>
                  <td className="label"><FaClock className="icon time" /> Time</td>
                  <td className="value">
                    {loc.timestampUTC
                      ? new Date(
                        `1970-01-01T${loc.timestampUTC.split('T')[1].replace('Z', '')}Z`
                      ).toLocaleTimeString([], {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: 'UTC'   // <- keep it in UTC so it shows "4:21 PM"
                      })
                      : '—'}
                  </td>
                </tr>

                <tr>
                  <td className="label"><FaDoorClosed className="icon door" /> Door</td>
                  <td className="value">{loc.door || '—'}</td>
                </tr>
                <tr>
                  <td className="label"><FaExchangeAlt className="icon direction" /> Direction</td>
                  <td className="value">{loc.direction || '—'}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>

      )}






    </div>
  );
}
C:\Users\W0024618\Desktop\employee-verification\frontend\src\components\EmployeeCard.jsx



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
              <td className="label"><FaIdCard /> Total Cards</td>
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
                       <i class="fas fa-window-close"></i>
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

            </tr>

            {/* Clearance row: shows ClearanceCount and clickable to open details */}
            {/* Clearance row: shows ClearanceCount and clickable to open details */}
            <tr className="clickable-row" ref={clearanceRef}>
              <td className="label">
                <FaCheckCircle color="#FFDD00" /> Clearance
              </td>
              <td
                className="value v-color clickable-cell"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowClearancePopup((prev) => !prev);
                }}
                title="Click to view clearance details"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setShowClearancePopup((prev) => !prev);
                  }
                }}
              >
                {emp.ClearanceCount ?? 0}
              </td>
            </tr>

            {/* ✅ Centered Clearance Popup */}
            {showClearancePopup && (
              <div className="popup-overlay" onClick={() => setShowClearancePopup(false)}>
                <div
                  className="popup-card fancy-popup"
                  onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
                >
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
                    <div>
                      <strong>Clearance Count:</strong> {emp.ClearanceCount ?? 0}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <strong>Clearances</strong>
                      <ul className="popup-list">
                        {(!emp.Clearances || emp.Clearances.trim() === '') && <li>—</li>}
                        {emp.Clearances &&
                          emp.Clearances.split(',').map((c, i) => (
                            <li key={`clr-${i}`}>{c.trim()}</li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

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


