/* CSS Variables for Themes */
:root {
  /* Light Theme */
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-card: #ffffff;
  --text-primary: #2d3748;
  --text-secondary: #4a5568;
  --text-muted: #718096;
  --border-color: #e2e8f0;
  --border-hover: #cbd5e0;
  --primary-color: #2563eb;
  --primary-hover: #1d4ed8;
  --success-color: #059669;
  --error-color: #dc2626;
  --warning-color: #d97706;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
}

.dark-mode {
  /* Dark Theme */
  --bg-primary: #1a202c;
  --bg-secondary: #2d3748;
  --bg-card: #2d3748;
  --text-primary: #f7fafc;
  --text-secondary: #e2e8f0;
  --text-muted: #a0aec0;
  --border-color: #4a5568;
  --border-hover: #718096;
  --primary-color: #3b82f6;
  --primary-hover: #60a5fa;
  --success-color: #10b981;
  --error-color: #ef4444;
  --warning-color: #f59e0b;
}

/* Base Container */
.incident-form-container {
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  transition: all 0.3s ease;
  padding: 0;
}

/* Form Header */
.form-header {
  background: linear-gradient(135deg, var(--primary-color), #7c3aed);
  color: white;
  padding: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  font-size: 2.5rem;
}

.form-header h1 {
  font-size: 1.75rem;
  margin: 0;
  font-weight: 700;
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.theme-toggle {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(30deg);
}

.save-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
}

.save-status.saving {
  color: #fbbf24;
}

.save-status.saved {
  color: #34d399;
}

.spin-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.form-intro {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  margin-top: 1rem;
}

/* Main Form */
.incident-form {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Form Sections */
.form-section {
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.form-section:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
  transition: all 0.3s ease;
}

/* Form Groups */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group.error {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* Form Labels */
.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-size: 0.9375rem;
}

.question-number {
  display: inline-block;
  background: var(--primary-color);
  color: white;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  text-align: center;
  line-height: 1.75rem;
  margin-right: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.required {
  color: var(--error-color);
  margin-left: 0.25rem;
}

/* Form Inputs */
.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.9375rem;
  transition: all 0.3s ease;
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23718096' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.5;
}

/* Form Rows */
.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

/* Radio Buttons */
.radio-group {
  display: flex;
  gap: 2rem;
  margin-top: 0.5rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--text-primary);
}

.radio-option input[type="radio"] {
  display: none;
}

.radio-custom {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.radio-option input[type="radio"]:checked + .radio-custom {
  border-color: var(--primary-color);
  background: var(--primary-color);
  box-shadow: inset 0 0 0 3px var(--bg-primary);
}

/* Checkbox Group */
.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--text-primary);
}

.checkbox-option input[type="checkbox"] {
  display: none;
}

.checkbox-custom {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.checkbox-option input[type="checkbox"]:checked + .checkbox-custom {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.checkbox-option input[type="checkbox"]:checked + .checkbox-custom::after {
  content: "✓";
  color: white;
  font-size: 0.75rem;
}

/* Form Notes */
.form-note {
  background: var(--bg-secondary);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Dynamic Rows */
.dynamic-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}

.dynamic-row .form-input {
  flex: 1;
}

.btn-remove {
  background: var(--error-color);
  color: white;
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-remove:hover {
  background: #b91c1c;
  transform: scale(1.05);
}

.btn-add {
  background: transparent;
  border: 2px dashed var(--border-color);
  color: var(--text-muted);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  margin-top: 0.5rem;
}

.btn-add:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: rgba(37, 99, 235, 0.05);
}

/* File Upload */
.file-upload-area {
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-lg);
  padding: 2rem;
  text-align: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.file-upload-area:hover {
  border-color: var(--primary-color);
  background: rgba(37, 99, 235, 0.02);
}

.file-input {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}

.file-upload-label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: var(--text-muted);
}

.file-upload-label small {
  color: var(--text-muted);
  font-size: 0.75rem;
}

.file-list {
  margin-top: 1rem;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  margin-bottom: 0.5rem;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.file-name {
  color: var(--text-primary);
  font-weight: 500;
}

.file-size {
  color: var(--text-muted);
  font-size: 0.875rem;
}

/* Error Messages */
.error-message {
  color: var(--error-color);
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Continue Section */
.continue-section {
  text-align: center;
  padding: 2rem;
  margin: 2rem 0;
}

.btn-continue {
  background: linear-gradient(135deg, var(--primary-color), #7c3aed);
  color: white;
  border: none;
  padding: 1rem 3rem;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-md);
}

.btn-continue:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Form Actions */
.form-actions {
  padding: 2rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  margin-top: 3rem;
  border: 1px solid var(--border-color);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), #7c3aed);
  color: white;
  border: none;
  padding: 1rem 3rem;
  border-radius: var(--radius-md);
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 1rem 2rem;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: var(--bg-secondary);
  border-color: var(--border-hover);
}

.form-footer {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.confidential-note {
  color: var(--warning-color);
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .incident-form {
    padding: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .dynamic-row {
    flex-direction: column;
  }
  
  .dynamic-row .form-input {
    width: 100%;
  }
  
  .btn-remove {
    align-self: flex-end;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
  
  .radio-group {
    flex-direction: column;
    gap: 1rem;
  }
  
  .checkbox-group {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .form-header {
    padding: 1rem;
  }
  
  .form-header h1 {
    font-size: 1.25rem;
  }
  
  .logo-icon {
    font-size: 1.75rem;
  }
  
  .file-upload-area {
    padding: 1.5rem;
  }
}