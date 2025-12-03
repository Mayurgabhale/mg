Absolutely — I will give you a clean, simple, company-ready project documentation for both Frontend + Backend that you can share with managers, HR, security, IT, or leadership.

This document will be written in clear, simple, organized English, easy for non-technical people to understand but still professional.


---

📘 Western Union – Incident Reporting & Management System

Project Documentation (Frontend + Backend)

Version 1.0 — Prepared for Organization Use


---

1. Project Overview

The Incident Reporting & Management System is a web application designed for Western Union employees, managers, HR, and security teams to report and manage workplace incidents.

The system allows any employee to submit incident reports online, and authorized teams can review, analyze, and take actions based on the information collected.

This platform improves:

✔ Safety
✔ Compliance
✔ Transparency
✔ Response speed
✔ Data accuracy


---

2. Project Goals

🎯 Primary Objectives

1. Provide a simple digital form for reporting incidents.


2. Store all incident data in a secure backend system.


3. Allow HR & Security teams to view, search, and analyze incident patterns.


4. Maintain accurate records for audits, compliance, and investigations.


5. Improve workplace safety and incident response time.




---

3. System Features

✔ Frontend Features (Employee-facing)

1. Incident Form

Employees can submit:

Type of incident (Medical, Theft, Fire, HR issue, Violence, Death, Fraud, etc.)

Date and time of report

Name & employee ID of impacted person

Was it verbally reported earlier?

If yes → whom it was reported to

Location of incident

Reporter details

Witnesses

Accompanying persons

Detailed incident description

Root cause (optional)

Preventive actions (optional)


2. Auto-Save Feature

The form automatically saves draft data in browser localStorage.

If browser closes unexpectedly → data is not lost.


3. Incident List (Admin/Security/HR)

View all reported incidents

Search incidents by:

Type

Impacted person

Reported by

Location


Table format

"View" button shows complete incident details

Modal popup to see incident JSON data


4. Simple, responsive UI

Clean, professional layout

Suitable for desktop & laptop usage

Separate dashboard and form area



---

4. Backend Features (API + Database)

✔ Backend (FastAPI / Python)

1. Create Incident API

POST /incident/create

Accepts full incident report

Validates required fields

Saves record to database

Returns success response


2. Get All Incidents API

GET /incident/list

Returns list of all incidents

Used by IncidentList component


3. Backend Validations

Ensures:

Required fields are provided

Data types are correct

Large text fields are allowed

Arrays (witnesses, accompanying people) are accepted


4. Database Storage

Stores incident reports in a structured format

Supports future analytics



---

5. Technology Stack

🟦 Frontend

Component	Technology

Framework	React.js
Styling	CSS (custom)
State Handling	useState, useEffect hooks
API Calls	fetch / axios
Auto-save	browser localStorage
UI Components	Custom React components



---

🟧 Backend

Component	Technology

Framework	FastAPI (Python)
Data Models	Pydantic
Database	SQLite / PostgreSQL (based on deployment)
API Routes	/incident/create, /incident/list
Validation	JSON & Pydantic schema
Hosting (future)	AWS / Azure / Local server



---

6. User Types

👤 1. Normal Employee

Can fill the incident reporting form

Can submit incident once

Cannot view all incidents


🛡 2. HR / Security / Admin

Can view all incidents

Can search incidents

Can download or analyze data

Can use dashboard for future planning



---

7. Workflow

Step 1 → Employee opens Incident Form

Step 2 → Fills details (auto-save works)

Step 3 → Submits the report

Step 4 → Backend validates and stores in DB

Step 5 → HR/Security team sees the report in Incident List

Step 6 → Data used for:

Workplace improvements

Risk management

Compliance

Safety tracking

Investigations



---

8. Future Scope (Phase 2 & Phase 3)

This project can be expanded easily.
Here are recommended future enhancements:

Phase 2 – Medium Priority

✔ Login system (Employee / HR / Admin roles)
✔ Email notification to HR/security
✔ Export to Excel / PDF
✔ Graphs and analytics dashboard
✔ Incident severity rating
✔ File uploads (images/videos)

Phase 3 – Advanced Features

✔ AI-based incident classification
✔ Predictive analytics (risk scoring)
✔ Automatic alerts for high-severity cases
✔ Integration with HRMS
✔ Mobile app version
✔ Workflow escalation with approvals


---

9. Project Folder Structure (Frontend)

frontend/
│
├── src/
│   ├── components/
│   │     ├── IncidentForm.jsx
│   │     └── IncidentList.jsx
│   │
│   ├── pages/
│   │     └── IncidentDashboard.jsx
│   │
│   ├── assets/css/
│   │     └── IncidentForm.css
│   │
│   ├── App.js
│   └── index.js
│
└── package.json


---

10. Deployment Plan

✔ Phase 1 Deployment

Host backend on internal server (FastAPI)

Host frontend on Netlify / Vercel / Internal web server

Connect both via API


✔ Phase 2 Deployment

Secure endpoints

Add login/authentication

Move to PostgreSQL

Backup/storage policies



---

11. Roles & Responsibilities

🟩 Developer

Build frontend + backend

Maintain API

Fix issues


🟨 Tester

Test form validation

API testing

Check data accuracy


🟪 HR / Security Team

Review incidents

Take actions

Conduct analysis



---

12. Conclusion

This Incident Reporting & Management System helps Western Union to:

✔ Improve workplace safety
✔ Maintain accurate incident records
✔ Track risks with real-time data
✔ Enable transparency & faster investigations
✔ Support compliance & legal reporting

The system is scalable, maintainable, and ready for future enhancements.


---

✅ Done — Full project documentation delivered

If you want:

📁 PDF version
📁 Word file (docx)
📁 Company-branded version
📁 Logo integration
📁 UI Mockups

Just tell me "Give PDF" or "Give DOCX", and I will generate it.