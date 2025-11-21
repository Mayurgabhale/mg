
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
