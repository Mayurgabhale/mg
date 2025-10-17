<div className="dashboard-grid">
  {filteredDashboards.map((d, index) => (
    <div 
      key={d.id} 
      className={`card ${d.status} ${activeCard === d.id ? 'active' : ''}`}
      style={{
        animationDelay: `${index * 0.1}s`,
        backgroundImage: `linear-gradient(rgba(15,23,42,0.8), rgba(15,23,42,0.9)), url(${d.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      onClick={() => handleClick(d)}
    >
      <div className="card-glow"></div>

      <div className="card-header">
        <div className="card-icon">{d.icon}</div>
        <h3>{d.name}</h3>
        <div className={`status-badge ${d.status}`}>
          {d.status === 'active' ? 'Online' : 'Offline'}
        </div>
      </div>

      <div className="card-body">
        <div className="connection-info">
          <span className="ip-address">{d.ip}</span>
          <span className="port">:{d.port}</span>
        </div>
      </div>

      <div className="card-footer">
        <div className="access-indicator">
          <span>Click to Access</span>
          <div className="arrow">→</div>
        </div>
      </div>
    </div>
  ))}
</div>