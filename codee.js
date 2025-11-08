/* Controller Grid - Specific for controllers only */
.controller-grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
}

/* For smaller screens */
@media (max-width: 1400px) {
  .controller-grid-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .controller-grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .controller-grid-container {
    grid-template-columns: 1fr;
  }
}

/* Controller Card - Specific styling */
.controller-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  min-height: 220px;
  display: flex;
  flex-direction: column;
}

.controller-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  border-color: #3b82f6;
}

/* Keep all your existing controller card styles below */
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
}

.controller-icon {
    font-size: 24px;
    background: #eff6ff;
    padding: 12px;
    border-radius: 8px;
    color: #3b82f6;
}

.status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

.status-indicator.online {
    background: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.status-indicator.offline {
    background: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.controller-name {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 16px 0;
    line-height: 1.3;
}

.controller-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
    flex-grow: 1;
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
}

.info-label {
    color: #6b7280;
    font-size: 14px;
    font-weight: 500;
}

.info-value {
    color: #374151;
    font-weight: 500;
    font-size: 14px;
}

.status {
    font-size: 14px;
    font-weight: 500;
    padding: 4px 8px;
    border-radius: 6px;
}

.status.online {
    color: #065f46;
    background: #d1fae5;
}

.status.offline {
    color: #991b1b;
    background: #fee2e2;
}

.card-footer {
    border-top: 1px solid #f3f4f6;
    padding-top: 16px;
    margin-top: auto;
}

.view-doors-btn {
    width: 100%;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    color: #374151;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s;
}

.view-doors-btn:hover {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
}

.arrow {
    transition: transform 0.2s;
}

.view-doors-btn:hover .arrow {
    transform: translateX(3px);
}