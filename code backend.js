/* IncidentForm.css - Simple Clean Version */

/* Basic Reset */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Arial, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

body.dark-mode {
  background-color: #1a1a1a;
  color: #f0f0f0;
}

/* Form Container */
.incident-form-container {
  max-width: 1000px;
  margin: 20px auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px;
}

body.dark-mode .incident-form-container {
  background: #2d2d2d;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

/* Form Header */
.form-header {
  border-bottom: 2px solid #007bff;
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  color: #007bff;
  font-size: 24px;
}

.form-header h1 {
  font-size: 24px;
  color: #333;
}

body.dark-mode .form-header h1 {
  color: #f0f0f0;
}

.subtitle {
  color: #666;
  font-size: 14px;
}

body.dark-mode .subtitle {
  color: #aaa;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.theme-toggle {
  background: #f0f0f0;
  border: 1px solid #ddd;
  color: #666;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
}

body.dark-mode .theme-toggle {
  background: #3d3d3d;
  border-color: #555;
  color: #ddd;
}

.theme-toggle:hover {
  background: #e0e0e0;
}

body.dark-mode .theme-toggle:hover {
  background: #4d4d4d;
}

.save-status {
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 5px;
}

body.dark-mode .save-status {
  color: #aaa;
}

.save-status.saving {
  color: #007bff;
}

.save-status.saved {
  color: #28a745;
}

.spin-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.form-intro {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  color: #666;
  border-left: 4px solid #007bff;
}

body.dark-mode .form-intro {
  background: #3d3d3d;
  color: #aaa;
  border-left-color: #0056b3;
}

/* Main Form */
.incident-form {
  padding: 10px 0;
}

/* Form Sections */
.form-section {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 15px;
  border: 1px solid #dee2e6;
}

body.dark-mode .form-section {
  background: #3d3d3d;
  border-color: #555;
}

/* Form Groups */
.form-group {
  margin-bottom: 15px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group.error {
  border-left: 4px solid #dc3545;
  padding-left: 10px;
}

/* Labels */
.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  font-size: 15px;
}

body.dark-mode .form-label {
  color: #f0f0f0;
}

.question-number {
  display: inline-block;
  background: #007bff;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  text-align: center;
  line-height: 24px;
  margin-right: 8px;
  font-size: 13px;
  font-weight: 600;
}

.required {
  color: #dc3545;
  margin-left: 4px;
}

/* Inputs */
.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 10px;
  background: white;
  border: 1px solid #ced4da;
  border-radius: 4px;
  color: #333;
  font-size: 15px;
}

body.dark-mode .form-input,
body.dark-mode .form-select,
body.dark-mode .form-textarea {
  background: #2d2d2d;
  border-color: #555;
  color: #f0f0f0;
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%23666' d='M5.5 7l4.5 4.5L14.5 7z'/%3E%3C/svg%3E");
  background-position: right 10px center;
  background-repeat: no-repeat;
  background-size: 12px;
  padding-right: 35px;
}

body.dark-mode .form-select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%23aaa' d='M5.5 7l4.5 4.5L14.5 7z'/%3E%3C/svg%3E");
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

body.dark-mode .form-input:focus,
body.dark-mode .form-select:focus,
body.dark-mode .form-textarea:focus {
  border-color: #0056b3;
  box-shadow: 0 0 0 2px rgba(0,86,179,0.25);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.4;
}

/* Form Rows */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}

/* Radio Buttons */
.radio-group {
  display: flex;
  gap: 20px;
  margin-top: 5px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #333;
}

body.dark-mode .radio-option {
  color: #f0f0f0;
}

.radio-option input[type="radio"] {
  margin: 0;
  width: 16px;
  height: 16px;
}

/* Checkbox Group */
.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 5px;
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #333;
}

body.dark-mode .checkbox-option {
  color: #f0f0f0;
}

.checkbox-option input[type="checkbox"] {
  margin: 0;
  width: 16px;
  height: 16px;
}

/* Form Notes */
.form-note {
  background: #e9ecef;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
  margin-top: 8px;
}

body.dark-mode .form-note {
  background: #4d4d4d;
  color: #aaa;
}

/* Dynamic Rows */
.dynamic-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}

.dynamic-row .form-input {
  flex: 1;
}

.btn-remove {
  background: #dc3545;
  color: white;
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
}

.btn-remove:hover {
  background: #c82333;
}

.btn-add {
  background: white;
  border: 1px solid #007bff;
  color: #007bff;
  padding: 8px 15px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-top: 5px;
}

body.dark-mode .btn-add {
  background: #2d2d2d;
  border-color: #0056b3;
  color: #0056b3;
}

.btn-add:hover {
  background: #007bff;
  color: white;
}

body.dark-mode .btn-add:hover {
  background: #0056b3;
}

/* File Upload */
.file-upload-area {
  border: 2px dashed #ced4da;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
  position: relative;
  cursor: pointer;
  margin-bottom: 10px;
}

body.dark-mode .file-upload-area {
  border-color: #555;
}

.file-upload-area:hover {
  border-color: #007bff;
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
  gap: 5px;
  color: #666;
}

body.dark-mode .file-upload-label {
  color: #aaa;
}

.file-upload-label small {
  color: #999;
  font-size: 12px;
}

body.dark-mode .file-upload-label small {
  color: #888;
}

.file-list {
  margin-top: 10px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 4px;
  margin-bottom: 5px;
  border: 1px solid #dee2e6;
}

body.dark-mode .file-item {
  background: #3d3d3d;
  border-color: #555;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-name {
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

body.dark-mode .file-name {
  color: #f0f0f0;
}

.file-size {
  color: #666;
  font-size: 12px;
}

body.dark-mode .file-size {
  color: #aaa;
}

/* Error Messages */
.error-message {
  color: #dc3545;
  font-size: 13px;
  margin-top: 5px;
}

/* Continue Section */
.continue-section {
  text-align: center;
  padding: 20px 0;
  margin: 20px 0;
}

.btn-continue {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.btn-continue:hover {
  background: #0056b3;
}

/* Form Actions */
.form-actions {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 6px;
  margin-top: 30px;
  border: 1px solid #dee2e6;
}

body.dark-mode .form-actions {
  background: #3d3d3d;
  border-color: #555;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: white;
  color: #333;
  border: 1px solid #ced4da;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

body.dark-mode .btn-secondary {
  background: #2d2d2d;
  color: #f0f0f0;
  border-color: #555;
}

.btn-secondary:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}

body.dark-mode .btn-secondary:hover {
  background: #4d4d4d;
  border-color: #666;
}

.form-footer {
  text-align: center;
  color: #666;
  font-size: 14px;
}

body.dark-mode .form-footer {
  color: #aaa;
}

.confidential-note {
  color: #dc3545;
  margin: 0;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .incident-form-container {
    margin: 10px;
    padding: 15px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
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
  
  .radio-group {
    flex-direction: column;
    gap: 10px;
  }
  
  .checkbox-group {
    flex-direction: column;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .form-header h1 {
    font-size: 20px;
  }
  
  .logo-icon {
    font-size: 20px;
  }
  
  .file-upload-area {
    padding: 15px;
  }
  
  .form-actions {
    padding: 15px;
  }
}