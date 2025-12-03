/* C:\Users\W0024618\Desktop\IncidentDashboard\frontend\src\assets\css\IncidentForm.css */

:root {
  --primary-color: #2563eb;
  --primary-dark: #1d4ed8;
  --secondary-color: #64748b;
  --success-color: #10b981;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  --background-color: #f8fafc;
  --card-color: #ffffff;
  --border-color: #e2e8f0;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --transition: all 0.2s ease;
}

* {
  box-sizing: border-box;
}

body {
  background-color: var(--background-color);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  color: var(--text-primary);
  line-height: 1.5;
  margin: 0;
  padding: 20px;
  min-height: 100vh;
}

.incident-card {
  background: var(--card-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 1000px;
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: var(--transition);
}

.incident-header {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  padding: 2rem 2.5rem;
  border-bottom: 1px solid var(--border-color);
}

.incident-header h2 {
  margin: 0 0 0.75rem 0;
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.incident-header .muted {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  max-width: 800px;
  line-height: 1.6;
}

.incident-form {
  padding: 2.5rem;
}

.row {
  margin-bottom: 1.75rem;
  position: relative;
}

.row label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.row .muted {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
  font-style: italic;
}

.required {
  color: var(--danger-color);
  font-weight: 700;
  margin-left: 2px;
}

input[type="text"],
input[type="email"],
input[type="tel"],
input[type="date"],
input[type="time"],
input[type="file"],
select,
textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  transition: var(--transition);
  background-color: white;
  color: var(--text-primary);
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="tel"]:focus,
input[type="date"]:focus,
input[type="time"]:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

input[type="text"]::placeholder,
input[type="email"]::placeholder,
textarea::placeholder {
  color: var(--text-muted);
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.25em;
  padding-right: 3rem;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.row-grid-2,
.row-grid-3 {
  display: grid;
  gap: 1.5rem;
}

.row-grid-2 {
  grid-template-columns: 1fr 1fr;
}

.row-grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 768px) {
  .row-grid-2,
  .row-grid-3 {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .incident-form {
    padding: 1.5rem;
  }
  
  .incident-header {
    padding: 1.5rem;
  }
}

.radio-row {
  display: flex;
  gap: 2rem;
  margin-top: 0.5rem;
}

.radio-row label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 0;
}

.radio-row input[type="radio"] {
  width: 1.25rem;
  height: 1.25rem;
  accent-color: var(--primary-color);
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  white-space: nowrap;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn:active {
  transform: translateY(0);
}

.btn.primary {
  background-color: var(--primary-color);
  color: white;
}

.btn.primary:hover {
  background-color: var(--primary-dark);
}

.btn.outline {
  background-color: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.btn.outline:hover {
  background-color: rgba(37, 99, 235, 0.05);
}

.btn.small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.error {
  color: var(--danger-color);
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error::before {
  content: "⚠";
}

.accompany-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  background-color: rgba(248, 250, 252, 0.5);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

@media (max-width: 640px) {
  .accompany-row {
    grid-template-columns: 1fr;
  }
}

.file-list {
  margin-top: 1rem;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: var(--background-color);
  border-radius: var(--radius-md);
  margin-bottom: 0.5rem;
  border: 1px solid var(--border-color);
}

.file-item span {
  font-size: 0.9rem;
  color: var(--text-secondary);
  flex-grow: 1;
}

.form-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 2px solid var(--border-color);
}

.form-actions .btn {
  min-width: 120px;
  justify-content: center;
}

.form-actions .muted {
  margin-left: auto;
  font-size: 0.875rem;
  color: var(--success-color);
  font-weight: 500;
}

/* Loading state for draft save */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.saving::after {
  content: "Saving draft...";
  animation: pulse 1.5s infinite;
}

/* Print styles */
@media print {
  body {
    background-color: white;
    padding: 0;
  }
  
  .incident-card {
    box-shadow: none;
    border: 1px solid #ddd;
  }
  
  .form-actions,
  .btn {
    display: none !important;
  }
  
  .incident-header {
    background: none;
    color: black;
    border-bottom: 2px solid #000;
  }
  
  .incident-header .muted {
    color: #666;
  }
}

/* Progress indicator */
.form-progress {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2rem 0 3rem;
  position: relative;
}

.form-progress::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--border-color);
  z-index: 1;
}

.progress-step {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.progress-step.active .step-circle {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.progress-step.completed .step-circle {
  background-color: var(--success-color);
  color: white;
  border-color: var(--success-color);
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: var(--transition);
}

.step-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
  white-space: nowrap;
}

.progress-step.active .step-label {
  color: var(--primary-color);
  font-weight: 600;
}

/* Section dividers */
.section-divider {
  display: flex;
  align-items: center;
  margin: 2.5rem 0 1.5rem;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 1.125rem;
}

.section-divider::before,
.section-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: var(--border-color);
}

.section-divider span {
  padding: 0 1rem;
}

/* Enhanced focus states */
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Animation for showing rest of form */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.incident-form > *:nth-child(n+7) {
  animation: slideDown 0.3s ease-out;
}