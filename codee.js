/* ============================= */
/*  Device Card – Theme Aware   */
/* ============================= */

.device-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 6px 16px var(--shadow);
  transition: all 0.3s ease;
  color: var(--text-primary);
}

/* Hover effect */
.device-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 28px var(--shadow);
}

/* Online / Offline indicator */
.device-card[data-status="online"] {
  border-left: 6px solid var(--success);
}

.device-card[data-status="offline"] {
  border-left: 6px solid var(--danger);
}

/* ============================= */
/*  Text Section                 */
/* ============================= */

.device-name {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 10px;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 6px;
}

.device-type-label {
  font-size: 17px;
  color: var(--text-secondary);
}

.device-card p {
  color: var(--text-secondary);
  font-size: 14px;
}

/* ============================= */
/*  IP Styling                   */
/* ============================= */

.device-ip {
  color: var(--text-accent);
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s ease, text-shadow 0.2s ease;
}

.device-ip:hover {
  color: var(--text-accent);
  text-shadow: 0 0 6px rgba(124, 58, 237, 0.5);
}

/* ============================= */
/* Icon Colors (Theme Based) */
/* ============================= */

.device-card i {
  color: var(--text-accent);
  opacity: 0.9;
}

.device-type-label.controllers i {
  color: #a855f7;
}

.device-type-label.cameras i {
  color: #3b82f6;
}

.device-type-label.archivers i {
  color: #f59e0b;
}

.device-type-label.servers i {
  color: #22c55e;
}

/* ============================= */
/* Status Text */
/* ============================= */

.device-status {
  margin-top: 12px;
  font-size: 14px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
}

/* Status dots */
.online-dot {
  background: var(--success);
}

.offline-dot {
  background: var(--danger);
}

.online-dot,
.offline-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}

/* ============================= */
/* Light Theme Specific Tweaks  */
/* ============================= */

body.theme-light .device-card {
  background: var(--bg-secondary);
  box-shadow: 0 3px 10px var(--shadow);
}

body.theme-light .device-name {
  color: var(--text-primary);
}

body.theme-light .device-card p {
  color: var(--text-secondary);
}

body.theme-light .device-ip {
  color: #2563eb;
}

/* ============================= */
/* Dark Theme Specific Tweaks   */
/* ============================= */

body:not(.theme-light) .device-card {
  background: var(--bg-card);
}

body:not(.theme-light) .device-ip {
  color: #22d3ee;
}