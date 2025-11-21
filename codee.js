{!loading && loc && !loc.found && (
  <>
    <div style={{ color: '#2ced0e', marginBottom: 8, fontWeight: 'bold' }}>
      Out of Office
    </div>

    {loc.lastSwipe ? (
      <table className="swipe-details-table">
        <tbody>
          <tr>
            <td className="label"><FaMapMarkerAlt /> Last Location</td>
            <td className="value">
              {loc.lastSwipe.partition || '—'}
              {loc.lastSwipe.floor ? ` · ${loc.lastSwipe.floor}` : ''}
            </td>
          </tr>

          <tr>
            <td className="label"><FaCalendarAlt /> Date</td>
            <td className="value">
              {loc.lastSwipe.timestampUTC
                ? loc.lastSwipe.timestampUTC.split('T')[0]
                : '—'}
            </td>
          </tr>

          <tr>
            <td className="label"><FaClock /> Time</td>
            <td className="value">
              {loc.lastSwipe.timestampUTC
                ? new Date(
                    `1970-01-01T${loc.lastSwipe.timestampUTC.split('T')[1].replace('Z', '')}Z`
                  ).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                    timeZone: 'UTC'
                  })
                : '—'}
            </td>
          </tr>

          <tr>
            <td className="label"><FaDoorClosed /> Door</td>
            <td className="value">{loc.lastSwipe.door || '—'}</td>
          </tr>

          <tr>
            <td className="label"><FaExchangeAlt /> Direction</td>
            <td className="value">{loc.lastSwipe.direction || '—'}</td>
          </tr>
        </tbody>
      </table>
    ) : (
      <div style={{ color: '#999' }}>No last swipe data available</div>
    )}
  </>
)}