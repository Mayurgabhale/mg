/* Very specific controller grid that will override existing styles */
#device-details .controller-grid-container {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 20px !important;
  padding: 20px !important;
}

/* For smaller screens */
@media (max-width: 1400px) {
  #device-details .controller-grid-container {
    grid-template-columns: repeat(3, 1fr) !important;
  }
}

@media (max-width: 1024px) {
  #device-details .controller-grid-container {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@media (max-width: 768px) {
  #device-details .controller-grid-container {
    grid-template-columns: 1fr !important;
  }
}

/* Specific controller card styles */
#device-details .controller-card {
  background: white !important;
  border-radius: 12px !important;
  padding: 20px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid #e5e7eb !important;
  transition: all 0.3s ease !important;
  cursor: pointer !important;
  position: relative !important;
  overflow: hidden !important;
  min-height: 220px !important;
  display: flex !important;
  flex-direction: column !important;
  margin: 0 !important;
  width: auto !important;
}

#device-details .controller-card:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12) !important;
  border-color: #3b82f6 !important;
}

/* Specific card header */
#device-details .controller-card .card-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: flex-start !important;
  margin-bottom: 16px !important;
}

#device-details .controller-card .controller-icon {
  font-size: 24px !important;
  background: #eff6ff !important;
  padding: 12px !important;
  border-radius: 8px !important;
  color: #3b82f6 !important;
}

#device-details .controller-card .status-indicator {
  width: 12px !important;
  height: 12px !important;
  border-radius: 50% !important;
}

#device-details .controller-card .status-indicator.online {
  background: #10b981 !important;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2) !important;
}

#device-details .controller-card .status-indicator.offline {
  background: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2) !important;
}

#device-details .controller-card .controller-name {
  font-size: 18px !important;
  font-weight: 600 !important;
  color: #1f2937 !important;
  margin: 0 0 16px 0 !important;
  line-height: 1.3 !important;
}

#device-details .controller-card .controller-info {
  display: flex !important;
  flex-direction: column !important;
  gap: 12px !important;
  margin-bottom: 20px !important;
  flex-grow: 1 !important;
}

#device-details .controller-card .info-item {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 8px 0 !important;
}

#device-details .controller-card .info-label {
  color: #6b7280 !important;
  font-size: 14px !important;
  font-weight: 500 !important;
}

#device-details .controller-card .info-value {
  color: #374151 !important;
  font-weight: 500 !important;
  font-size: 14px !important;
}

#device-details .controller-card .status {
  font-size: 14px !important;
  font-weight: 500 !important;
  padding: 4px 8px !important;
  border-radius: 6px !important;
}

#device-details .controller-card .status.online {
  color: #065f46 !important;
  background: #d1fae5 !important;
}

#device-details .controller-card .status.offline {
  color: #991b1b !important;
  background: #fee2e2 !important;
}

#device-details .controller-card .card-footer {
  border-top: 1px solid #f3f4f6 !important;
  padding-top: 16px !important;
  margin-top: auto !important;
}

#device-details .controller-card .view-doors-btn {
  width: 100% !important;
  background: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
  color: #374151 !important;
  padding: 10px 16px !important;
  border-radius: 8px !important;
  cursor: pointer !important;
  font-weight: 500 !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  transition: all 0.2s !important;
}

#device-details .controller-card .view-doors-btn:hover {
  background: #3b82f6 !important;
  color: white !important;
  border-color: #3b82f6 !important;
}

#device-details .controller-card .arrow {
  transition: transform 0.2s !important;
}

#device-details .controller-card .view-doors-btn:hover .arrow {
  transform: translateX(3px) !important;
}