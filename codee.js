<div style={{ color: '#aaa', fontSize: '12px', marginTop: '3px' }}>
  Last swipe: {loc.direction || '—'} at{' '}
  {loc.timestampUTC
    ? new Date(loc.timestampUTC).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    : 'No data'}
</div>