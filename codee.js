/* === EmployeeTravelDashboard.css === */

.page {
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 24px;
  color: #1e293b;
  font-family: "Inter", "Segoe UI", system-ui, sans-serif;
  line-height: 1.5;
}

/* Header */
.header {
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-title {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.header-subtitle {
  font-size: 16px;
  color: #64748b;
}

/* Layout */
.layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  max-width: 1400px;
  margin: 0 auto;
}

/* Sidebar */
.sidebar {
  flex: 0 0 320px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.side-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
  border: 1px solid #e2e8f0;
}

.side-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.side-empty {
  color: #9ca3af;
  font-size: 14px;
  text-align: center;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  color: #9ca3af;
}

/* Table */
.table-section {
  margin-top: 24px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.table-title {
  font-size: 18px;
  font-weight: 600;
}

.table-badge {
  background: #eff6ff;
  color: #1d4ed8;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 14px;
}

.table-wrap {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  color: #374151;
}

.table tr:nth-child(even) {
  background: #f9fafb;
}

.empty-row {
  text-align: center;
  color: #9ca3af;
  padding: 24px;
}

/* Badges */
.active-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #dcfce7;
  color: #16a34a;
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 13px;
  font-weight: 600;
}

.inactive-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fee2e2;
  color: #b91c1c;
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 13px;
  font-weight: 600;
}

.type-badge {
  background: #fef3c7;
  color: #92400e;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  background: #e0e7ff;
  color: #1e3a8a;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.email-cell {
  display: flex;
  align-items: center;
  color: #6b7280;
}

.date-cell {
  display: flex;
  align-items: center;
  color: #6b7280;
  font-size: 13px;
}

.empty-subtext {
  font-size: 13px;
  color: #9ca3af;
  margin-top: 4px;
}