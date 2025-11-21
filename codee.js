getEmployeeLiveLocation error ReferenceError: r is not defined
    at getEmployeeLiveLocation (C:\Users\W0024618\Desktop\employee-verification\controllers\employeeLocationController.js:367:7)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

{!loading && loc && !loc.found && (
  <div style={{ color: '#2ced0e' }}>
    <div>Out off office</div>

    {loc.lastSwipe ? (
      <div style={{ marginTop: 6, fontSize: 13 }}>
        <table style={{ marginTop: 4 }}>
          <tbody>
            <tr>
              <td style={{ paddingRight: 8 }}>Last Door:</td>
              <td>{loc.lastSwipe.door || '—'}</td>
            </tr>

            <tr>
              <td style={{ paddingRight: 8 }}>Direction:</td>
              <td>{loc.lastSwipe.direction || '—'}</td>
            </tr>

            <tr>
              <td style={{ paddingRight: 8 }}>Time:</td>
              <td>
                {loc.lastSwipe.time
                  ? new Date(loc.lastSwipe.time).toLocaleTimeString([], {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })
                  : '—'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ) : (
      <div style={{ marginTop: 6, fontSize: 13, color: '#ccc' }}>
        No swipe data available
      </div>
    )}
  </div>
)}


...


if (!matches.length) {
  const result = {
    found: false,
    isOut: true,
    message: 'Employee is currently outside office',
    partition: null,
    floor: null,
    Zone: null,
    door: null,
    direction: null,
    timestampUTC: null,
    lastSwipe: null
  };

  cache[employeeObjId] = { ts: Date.now(), data: result };
  return res.json(result);
}



....

const isOut =
  r.Direction &&
  r.Direction.toLowerCase().includes('out');




....




const payload = {
  found: !isOut,          // ✅ if OUT → not found (Outside Office)
  isOut: isOut,           // ✅ explicit flag
  source: r.__source || null,
  partition: r.PartitionName2 || r.Partition || null,
  floor: r.Floor || r.Zone || r.floor || null,
  Zone: r.Zone,
  door: r.Door || null,
  direction: r.Direction || null,
  timestampUTC: r.LocaleMessageTime || r.snapshotTime || `${r.Dateonly}T${r.Swipe_Time}Z` || null,
  personnelType: r.PersonnelType || null,
  cardNumber: r.CardNumber || null,

  // ✅ NEW: last swipe info
  lastSwipe: {
    door: r.Door || null,
    direction: r.Direction || null,
    time: r.LocaleMessageTime || r.snapshotTime || `${r.Dateonly}T${r.Swipe_Time}Z` || null
  },

  raw: r
};





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






  return (
    <div className="current-location-card" style={{ marginTop: 1 }}>
      <h4 style={{ margin: '0 0 6px 0', fontSize: 14, color: '#f5a742' }}>Swipe Details</h4>

      {loading && <div style={{ color: '#fff' }}>Loading location…</div>}
      {error && <div style={{ color: '#fff' }}>{error}</div>}

      {/* {!loading && loc && !loc.found && (
        <div style={{ color: '#2ced0e' }}>Out off office</div>
      )} */}

      {!loading && loc && !loc.found && (
        <div style={{ color: '#2ced0e' }}>
          <div>Out off office</div>

          {loc.lastSwipe ? (
            <div style={{ marginTop: 6, fontSize: 13 }}>
              <table style={{ marginTop: 4 }}>
                <tbody>
                  <tr>
                    <td style={{ paddingRight: 8 }}>Last Door:</td>
                    <td>{loc.lastSwipe.door || '—'}</td>
                  </tr>

                  <tr>
                    <td style={{ paddingRight: 8 }}>Direction:</td>
                    <td>{loc.lastSwipe.direction || '—'}</td>
                  </tr>

                  <tr>
                    <td style={{ paddingRight: 8 }}>Time:</td>
                    <td>
                      {loc.lastSwipe.time
                        ? new Date(loc.lastSwipe.time).toLocaleTimeString([], {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })
                        : '—'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ marginTop: 6, fontSize: 13, color: '#ccc' }}>
              No swipe data available
            </div>
          )}
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

