{!loading && loc && isEmployeeOut(loc) && (
  <div style={{ marginBottom: 6 }}>
    <div style={{ color: '#2ced0e' }}>Out of Office</div>

    <div style={{ color: '#aaa', fontSize: '12px', marginTop: '2px' }}>
      Last swipe: {loc.direction || '—'} at{' '}
      {loc.timestampUTC
        ? new Date(loc.timestampUTC).toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })
        : 'No data'}
    </div>
  </div>
)}