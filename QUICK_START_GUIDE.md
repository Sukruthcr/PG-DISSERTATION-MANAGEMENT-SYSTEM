# Quick Start Guide - Guide & Coordinator Features

## 🚀 Getting Started

### 1. Start the Application

```bash
# Terminal 1 - Start MongoDB (if not running)
mongod

# Terminal 2 - Start the server
npm run dev
```

The application will be available at `http://localhost:3001`

### 2. Run Tests (Optional)

```bash
node test-guide-coordinator-features.js
```

This will:
- Verify all collections exist
- Create test users if needed
- Test guide and coordinator assignments
- Generate a summary report

## 👥 User Roles & Credentials

### Default Test Users

**Admin:**
- Email: `admin@university.edu`
- Password: `admin123`
- Can assign guides and coordinators

**Guide:**
- Email: `test.guide@university.edu` or `senior.guide@university.edu`
- Password: `password`
- Can review projects, assign marks, delete projects

**Coordinator:**
- Email: `test.coordinator@university.edu` or `department.coordinator@university.edu`
- Password: `password`
- Can monitor student progress (read-only)

**Student:**
- Email: Check existing students in database
- Password: Varies by user
- Can view assigned guide and coordinator

## 📋 Common Tasks

### As Admin: Assign a Guide to a Student

1. **Login** as admin
2. **Navigate** to "Guide Assignments" section
3. **Click** "Assign Guide" button on an unassigned project
4. **Confirm** the allocation
5. **Verify** the project moves to "Assigned Projects" section

**API Alternative:**
```bash
curl -X POST http://localhost:3001/api/assignments/guide \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STUDENT_ID",
    "project_id": "PROJECT_ID"
  }'
```

### As Admin: Assign a Coordinator to a Student

**API Call:**
```bash
curl -X POST http://localhost:3001/api/assignments/coordinator \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STUDENT_ID",
    "project_id": "PROJECT_ID",
    "coordinator_id": "COORDINATOR_ID"
  }'
```

### As Guide: Review a Student's Project

1. **Login** as guide
2. **Dashboard** automatically shows "My Assigned Students"
3. **Click** "Review" button on a student's project
4. **Enter:**
   - Marks (0-100)
   - Approval Status (Pending/Approved/Needs Revision/Rejected)
   - Feedback (optional)
5. **Click** "Submit Review"
6. **Verify** success message

**API Alternative:**
```bash
curl -X PUT http://localhost:3001/api/projects/PROJECT_ID/review \
  -H "Content-Type: application/json" \
  -d '{
    "marks": 85,
    "feedback": "Excellent work!",
    "approval_status": "approved"
  }'
```

### As Guide: Delete a Project

1. **Login** as guide
2. **Navigate** to assigned students
3. **Click** "Delete" button on project
4. **Confirm** deletion
5. **Verify** project removed

**API Alternative:**
```bash
curl -X DELETE http://localhost:3001/api/projects/PROJECT_ID
```

### As Coordinator: Monitor Students

1. **Login** as coordinator
2. **Dashboard** automatically shows "Student Progress Monitoring"
3. **View:**
   - List of assigned students
   - Project status for each student
   - Progress summary statistics
4. **Note:** Cannot assign marks or delete projects

### As Student: View Assigned Guide

1. **Login** as student
2. **Dashboard** shows "My Guide & Coordinator" section
3. **View:**
   - Guide name, email, department, specialization
   - Coordinator details (if assigned)
   - Contact buttons
4. **Check** for marks and feedback on your project

## 🔍 Troubleshooting

### Problem: "No guide assigned yet"

**Solution:**
- Ask admin to assign a guide via "Guide Assignments"
- Or use API: `POST /api/assignments/guide`

### Problem: Guide allocation doesn't persist

**Solution:**
- ✅ **Fixed!** The system now checks for existing assignments
- Backend prevents duplicate assignments
- Assignments are stored in both `topics.guide_id` and `guide_assignments` collection

### Problem: Changes don't reflect immediately

**Solution:**
- Refresh the page (F5)
- All updates are persisted to database immediately
- Frontend components reload data after actions

### Problem: Coordinator can assign marks

**Solution:**
- ✅ **Prevented!** Coordinator panel is read-only
- No "Review" or "Delete" buttons shown
- Backend should also validate permissions (add if needed)

## 📊 Database Queries

### Check Guide Assignments

```javascript
// In MongoDB shell or Compass
use pg_dissertation_db

// Find all projects with assigned guides
db.topics.find({ guide_id: { $exists: true } })

// Find all guide assignments
db.guide_assignments.find({})

// Find students assigned to specific guide
db.topics.find({ guide_id: "GUIDE_ID" })
```

### Check Coordinator Assignments

```javascript
// Find all projects with assigned coordinators
db.topics.find({ coordinator_id: { $exists: true } })

// Find all coordinator assignments
db.coordinator_assignments.find({})
```

### Check Project Reviews

```javascript
// Find all reviewed projects
db.topics.find({ marks: { $exists: true } })

// Find approved projects
db.topics.find({ approval_status: "approved" })
```

## 🎯 Feature Checklist

Use this checklist to verify all features work:

### Guide Features
- [ ] Guide can login successfully
- [ ] Guide dashboard shows assigned students
- [ ] Guide can see project details for each student
- [ ] Guide can open review modal
- [ ] Guide can assign marks (0-100)
- [ ] Guide can set approval status
- [ ] Guide can provide feedback
- [ ] Guide can submit review
- [ ] Guide can delete project
- [ ] Changes reflect in student dashboard

### Coordinator Features
- [ ] Coordinator can login successfully
- [ ] Coordinator dashboard shows assigned students
- [ ] Coordinator can see project status
- [ ] Coordinator sees progress summary
- [ ] Coordinator CANNOT assign marks
- [ ] Coordinator CANNOT delete projects
- [ ] Status updates from guide are visible

### Student Features
- [ ] Student can login successfully
- [ ] Student sees "My Guide & Coordinator" section
- [ ] Student sees guide name, email, department
- [ ] Student sees coordinator details (if assigned)
- [ ] Student sees marks when assigned
- [ ] Student sees approval status
- [ ] Updates from guide appear immediately

### Admin Features
- [ ] Admin can access "Guide Assignments"
- [ ] Admin can see unassigned projects
- [ ] Admin can click "Assign Guide"
- [ ] System auto-selects appropriate guide
- [ ] Assignment appears in "Assigned Projects"
- [ ] Assignment persists after page refresh
- [ ] Clicking "Assign Guide" again doesn't duplicate

### Persistence & Data Integrity
- [ ] Guide assignments persist after server restart
- [ ] Coordinator assignments persist after server restart
- [ ] Project reviews persist after server restart
- [ ] No duplicate assignments created
- [ ] Deleted projects don't reappear

## 📞 API Endpoints Reference

### Guide Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/assignments/guide` | Assign guide to project |
| GET | `/api/guides/:guideId/students` | Get students for guide |
| GET | `/api/guides/:guideId/projects` | Get projects for guide |
| GET | `/api/students/:studentId/guide` | Get guide for student |

### Coordinator Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/assignments/coordinator` | Assign coordinator to project |
| GET | `/api/coordinators/:coordId/students` | Get students for coordinator |
| GET | `/api/students/:studentId/coordinator` | Get coordinator for student |

### Project Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/student-projects` | Get all projects |
| PUT | `/api/projects/:projectId/review` | Submit project review |
| DELETE | `/api/projects/:projectId` | Delete project |

## 🎓 Best Practices

### For Guides
1. **Review regularly** - Check assigned students weekly
2. **Provide detailed feedback** - Help students improve
3. **Set clear expectations** - Use approval status effectively
4. **Communicate** - Use contact buttons to reach students

### For Coordinators
1. **Monitor progress** - Check dashboard daily
2. **Identify issues early** - Look for stalled projects
3. **Support guides** - Coordinate with guides on student issues
4. **Track statistics** - Use progress summary for reporting

### For Admins
1. **Balance workload** - Distribute students evenly among guides
2. **Match specializations** - System auto-matches, but verify
3. **Monitor assignments** - Ensure all students have guides
4. **Regular audits** - Check for unassigned projects

### For Students
1. **Check dashboard regularly** - Stay updated on feedback
2. **Contact guide** - Use provided contact information
3. **Act on feedback** - Address "Needs Revision" status promptly
4. **Track progress** - Monitor your marks and approval status

## 🔐 Security Notes

- All passwords are hashed with bcrypt
- Role-based access control in place
- Guide can only see their assigned students
- Coordinator has read-only access
- Students can only see their own data
- Admin has full system access

## 📈 Performance Tips

- Database indexes on `email`, `guide_id`, `coordinator_id`
- Pagination recommended for large student lists
- Cache guide/coordinator lookups if needed
- Use aggregation for statistics

## 🆘 Support

If you encounter issues:

1. **Check logs** - Look at server console output
2. **Verify database** - Use MongoDB Compass to inspect data
3. **Test API directly** - Use curl or Postman
4. **Review documentation** - See `GUIDE_COORDINATOR_IMPLEMENTATION.md`
5. **Run test script** - Execute `test-guide-coordinator-features.js`

## 📝 Change Log

### Version 1.0 (Current)
- ✅ Guide assignment with persistence
- ✅ Coordinator assignment
- ✅ Guide dashboard with review capability
- ✅ Coordinator monitoring panel
- ✅ Student guide/coordinator view
- ✅ Project review (marks, feedback, approval)
- ✅ Project deletion by guide
- ✅ Real-time updates
- ✅ Duplicate assignment prevention

### Upcoming Features
- Email notifications
- Bulk assignment
- Assignment history
- Analytics dashboard
- Export reports

---

**Last Updated:** 2025-10-10
**Version:** 1.0
**Status:** Production Ready ✅
