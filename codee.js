{/* 🆕 TODAY'S TRAVELERS SECTION */}
<div style={sideCard}>
  <div style={cardHeader}>
    <FiCalendar style={cardIcon} />
    <h3 style={sideTitle}>Today's Travelers ({today.toLocaleDateString()})</h3>
  </div>

  {todayTravelers.length === 0 ? (
    <div style={emptyState}>
      <FiFileText size={24} style={{ color: '#9ca3af', marginBottom: '8px' }} />
      <p style={sideEmpty}>No one is traveling today</p>
    </div>
  ) : (
    <ul style={countryList}>
      {todayTravelers.map((t, i) => (
        <li key={i} style={countryItem}>
          <div style={countryInfo}>
            <span style={countryRank}>{i + 1}</span>
            <span style={countryName}>
              {t.first_name} {t.last_name}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {t.from_country} → {t.to_country}
          </div>
        </li>
      ))}
    </ul>
  )}
</div>