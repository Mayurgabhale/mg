Western Union Incident Management System - Project Documentation

📋 Project Overview

Project Name: WU Incident Management System
Purpose: A secure platform for employees to report safety, security, and HR incidents for better workplace management and future prevention
Audience: All Western Union employees globally

🎯 Core Purpose

1. Immediate Goal: Collect incident data quickly and securely
2. Future Goal: Analyze patterns to prevent future incidents
3. Compliance: Meet safety and HR reporting requirements

✨ Current Features

1. Frontend Features (React Dashboard)

```
✅ **Incident Form**
   - 21-field comprehensive reporting form
   - Auto-save to prevent data loss
   - Form validation with error messages
   - Branching logic (if verbally reported → show more options)
   - Dynamic fields (add/remove witnesses, accompanying persons)

✅ **Incident List**
   - View all submitted incidents
   - Search by type, name, location
   - Click to view full details
   - Refresh button to get latest data

✅ **Dashboard**
   - Modern, professional design
   - Tab navigation (New Report, All Incidents, Analytics)
   - Stats cards showing totals
   - Quick access buttons
```

2. Backend Features (FastAPI)

```
✅ **API Endpoints**
   - POST /incident/create → Save new incident
   - GET /incident/list → Get all incidents
   - (Planned) GET /incident/stats → Get dashboard statistics

✅ **Data Storage**
   - JSON data structure
   - Future: Database integration ready

✅ **Security**
   - Basic input validation
   - Future: Authentication planned
```

📊 Data Flow

```
Employee fills form → 
Data saves locally (auto-save) → 
Employee submits → 
Data sends to backend → 
Saved in database → 
Appears in incident list → 
Managers can view/analyze
```

🔮 Future Requirements

Phase 1: Enhanced Features (Next 1-2 months)

```
🔹 **Priority Features:**
   - User login system (different roles: Employee, Manager, Admin)
   - Email notifications when incident submitted
   - Export reports to PDF/Excel
   - Attach photos/documents to incidents

🔹 **Better Dashboard:**
   - Real-time charts (incidents by type, location, time)
   - Priority tagging (High/Medium/Low)
   - Status tracking (Open → In Progress → Resolved)
   - Assignment to safety officers
```

Phase 2: Advanced Features (3-6 months)

```
🔸 **Analytics:**
   - Machine learning to detect patterns
   - Alert system for similar incidents
   - Prediction of high-risk areas/times
   - Monthly automated reports

🔸 **Mobile App:**
   - iOS/Android app for reporting
   - Push notifications
   - Location auto-detection
   - Offline reporting capability

🔸 **Integration:**
   - Connect with HR systems
   - Link to security cameras (if applicable)
   - Slack/Teams notifications
   - Emergency contact systems
```

Phase 3: Enterprise Features (6-12 months)

```
🔹 **Global Features:**
   - Multi-language support
   - Regional compliance rules
   - Audit trails (who saw/changed what)
   - Backup and disaster recovery

🔹 **Advanced Security:**
   - Two-factor authentication
   - Data encryption
   - Access logs
   - GDPR compliance tools
```

🏗️ System Architecture

Frontend (What you see)

```
React.js Application
├── Pages
│   └── Dashboard (main page)
├── Components
│   ├── IncidentForm (reporting form)
│   ├── IncidentList (view all incidents)
│   └── DashboardStats (shows numbers)
└── CSS
    └── Styling for good look
```

Backend (What works behind)

```
FastAPI Server (Python)
├── Database (SQLite → later PostgreSQL)
├── API Routes
│   ├── /incident/create (save new)
│   ├── /incident/list (get all)
│   └── /incident/stats (get counts)
└── Data Models
    └── Defines what data looks like
```

📁 File Structure

```
IncidentDashboard/
├── frontend/ (React app)
│   ├── public/ (images, icons)
│   └── src/
│       ├── components/ (IncidentForm, IncidentList)
│       ├── pages/ (Dashboard)
│       ├── assets/ (CSS files)
│       └── services/ (API calls)
└── backend/ (FastAPI server)
    ├── main.py (server code)
    ├── models.py (data structure)
    └── database.py (database setup)
```

🔐 Security Requirements

```
Level 1 (Now):
- Form validation
- Basic API protection

Level 2 (Soon):
- User login with passwords
- Role-based access
- HTTPS encryption

Level 3 (Later):
- Two-factor authentication
- Audit logging
- Data encryption at rest
```

📱 User Roles

```
1. **Employee**
   - Can submit incident reports
   - Can view own submissions
   - Cannot see others' data

2. **Manager**
   - Can see all incidents in their department
   - Can update incident status
   - Can assign to team members

3. **Safety Officer**
   - Full access to all incidents
   - Can create analytics reports
   - Can close incidents

4. **Admin**
   - Everything + user management
   - System configuration
   - Data export rights
```

🚨 Emergency Features Needed

```
1. **Red Alert Button**
   - One-click emergency reporting
   - Immediate notifications to safety team
   - Location sharing

2. **Emergency Contacts**
   - Quick dial buttons
   - Building evacuation plans
   - First aid instructions

3. **Offline Mode**
   - Work without internet
   - Sync when connection returns
   - Local storage of reports
```

📈 Metrics to Track

```
**For Employees:**
- Time to submit report (target: <5 minutes)
- Form completion rate
- User satisfaction score

**For Management:**
- Incidents resolved per week
- Average resolution time
- Recurring issue patterns
- High-risk departments/locations

**For Compliance:**
- Reports submitted on time
- Required fields completion
- Audit trail completeness
```

🛠️ Technical Requirements

Frontend Tech Stack

```
- React.js (current)
- React Router (for multiple pages)
- Axios (for API calls)
- Chart.js (for graphs)
- Bootstrap/Material UI (for design)
```

Backend Tech Stack

```
- FastAPI (current Python framework)
- SQLite → PostgreSQL (database)
- JWT (for login tokens)
- Celery (for background tasks like emails)
- Redis (for caching)
```

Deployment

```
Development: Local computer
Testing: Test server
Production: Cloud server (AWS/Azure)
Database: Cloud database service
Backup: Daily automated backups
```

🔄 Workflow Example

```
1. Incident happens at 10:00 AM
2. Employee opens dashboard at 10:05 AM
3. Clicks "New Report" tab
4. Fills form (3-5 minutes)
5. Submits → gets confirmation
6. Safety team gets notification
7. Manager reviews and assigns
8. Team works on resolution
9. Status updates to "Resolved"
10. System analyzes for patterns
```

💡 Simple Instructions for Future Developers

To Add New Field to Form:

1. Add field name in blankDraft object
2. Add input in JSX
3. Update validation if required
4. Add to backend model

To Add New Chart:

1. Create new component in components/
2. Add API endpoint in backend
3. Connect with Chart.js
4. Add to dashboard

To Add User Login:

1. Create login page
2. Add auth endpoints in backend
3. Add token storage
4. Protect routes based on role

📞 Support & Maintenance

```
Daily:
- Check if system is running
- Check for new reports
- Monitor error logs

Weekly:
- Generate weekly report
- Backup database
- Update if needed

Monthly:
- System updates
- Security checks
- User feedback review
```

🎯 Success Metrics

```
The project is successful if:
1. 90% of incidents are reported within 24 hours
2. 95% of reports have complete information
3. Managers spend 50% less time collecting data
4. Repeat incidents decrease by 30% in 6 months
5. Employee satisfaction with safety > 4/5 stars
```

---

📝 Simple Summary

What we have now:

· Basic form to report incidents
· List to view reports
· Simple dashboard

What we need soon:

· Login system
· Better analytics
· Mobile support

What we want eventually:

· Smart predictions
· Global multi-language
· Emergency features

Why this matters:

· Safer workplace
· Faster reporting
· Better decisions from data
· Legal compliance

Who uses it:

· All employees (report)
· Managers (review)
· Safety team (action)
· Leadership (analytics)

This documentation should help anyone understand the project quickly - whether they're a developer, manager, or new team member!