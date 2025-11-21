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


....

{!loading && loc && isEmployeeOut(loc) && (
  <div style={{ color: '#2ced0e' }}>Out of Office</div>
)}

{!loading && loc && isEmployeeOut(loc) && loc.found && (
  <div style={{ color: '#aaa', fontSize: '12px', marginTop: '4px' }}>
    Last swipe: {loc.direction || '—'} at{' '}
    {loc.timestampUTC
      ? new Date(loc.timestampUTC).toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      : '—'}
  </div>
)}

{!loading && loc && loc.found && !isEmployeeOut(loc) && (
  <table className="swipe-details-table">
    ...
  </table>
)}
