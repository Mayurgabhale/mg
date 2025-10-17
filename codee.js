<div className="dashboard-grid">
  {filteredDashboards.map((d, index) => (
    <div
      key={d.id}
      className={`card ${d.status} ${activeCard === d.id ? 'active' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => handleClick(d)}
    >
      <div className="card-glow"></div>

      {/* Image section */}
      <div className="card-image">
        <img src={d.image} alt={d.name} />
      </div>

      <div className="card-header">
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


.card-image {
  width: 100%;
  height: 140px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
  border: 1px solid rgba(255,255,255,0.05);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.card:hover .card-image img {
  transform: scale(1.05);
}