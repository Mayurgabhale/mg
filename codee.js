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