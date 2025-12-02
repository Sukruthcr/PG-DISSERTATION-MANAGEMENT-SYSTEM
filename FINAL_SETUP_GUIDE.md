# Final Setup Guide - Complete System

## 🎯 What's Been Fixed

### 1. ✅ Project Submission (NEW)
- Students can now submit projects via API
- Endpoint: `POST /api/projects`
- Prevents duplicate submissions

### 2. ✅ Project Editing (NEW)
- Students and guides can edit projects
- Endpoint: `PUT /api/projects/:projectId`

### 3. ✅ Guide Assignment (FIXED)
- Group allocation now saves to database
- Endpoint: `POST /api/assignments/guide/group`
- Assignments persist across refreshes

### 4. ✅ Project Approval/Review (EXISTS)
- Guides can approve, reject, or request revisions
- Endpoint: `PUT /api/projects/:projectId/review`
- Assign marks (0-100)
- Provide feedback

### 5. ✅ Project Deletion (EXISTS)
- Guides can delete projects
- Endpoint: `DELETE /api/projects/:projectId`

### 6. ✅ Database Cleanup (NEW)
- Remove all sample/demo projects
- Script: `cleanup-database.js`
- Endpoint: `DELETE /api/projects` (all projects)

## 🚀 IMMEDIATE STEPS TO GET WORKING SYSTEM

### Step 1: Clean the Database

Run the cleanup script:

```bash
node cleanup-database.js
```

This will:
- Delete all sample/demo projects
- Clear all guide assignments
- Clear all coordinator assignments
- Preserve user accounts

### Step 2: Restart the Server

```bash
node server.js
```

Wait for:
```
✅ Connected to MongoDB successfully
✅ Database collections initialized
🚀 Server running on port 3001
```

### Step 3: Build Frontend (if needed)

```bash
npm run build
```

### Step 4: Hard Refresh Browser

Press **Ctrl+Shift+R** to clear cache

## 📝 Complete Workflow

### As Student:

1. **Login** (student@university.edu / password123)

2. **Submit Project**
   - Go to "Submit Project" section
   - Fill in:
     - Title
     - Description
     - Specialization
     - Keywords
   - Click "Submit"
   - Project saved with status "Pending"

3. **View Guide**
   - Once admin assigns guide
   - See guide details in "My Guide & Coordinator"

4. **Check Marks**
   - After guide reviews
   - See marks and feedback

### As Admin:

1. **Login** (admin@university.edu / admin123)

2. **View All Projects**
   - See all submitted projects
   - Check status of each

3. **Assign Guides**
   - Go to "Guide Assignments"
   - Select a group/project
   - Click "Assign Guide"
   - Choose guide
   - Confirm

4. **Monitor System**
   - Check guide workloads
   - View assignment statistics

### As Guide:

1. **Login** (guide@university.edu / password123)

2. **View Assigned Students**
   - Dashboard shows all assigned students
   - See project details

3. **Review Project**
   - Click "Review" on a student
   - Enter marks (0-100)
   - Select status:
     - Approved
     - Needs Revision
     - Rejected
   - Add feedback
   - Click "Submit Review"

4. **Edit Project** (if needed)
   - Click "Edit" on project
   - Modify title/description
   - Save changes

5. **Delete Project** (if needed)
   - Click "Delete" on project
   - Confirm deletion

### As Coordinator:

1. **Login** (coordinator@university.edu / password123)

2. **Monitor Progress**
   - View all assigned students
   - See project statuses
   - Track approval progress
   - Cannot modify or delete

## 🔧 API Endpoints Reference

### Project Management

```javascript
// Submit new project
POST /api/projects
Body: {
  student_id: "20221ISE0092",
  title: "Project Title",
  description: "Project description",
  specialization: "Machine Learning",
  keywords: ["AI", "ML"]
}

// Update project
PUT /api/projects/:projectId
Body: {
  title: "Updated Title",
  description: "Updated description"
}

// Delete project
DELETE /api/projects/:projectId

// Delete ALL projects (admin only)
DELETE /api/projects

// Get all projects
GET /api/student-projects
```

### Guide Assignment

```javascript
// Assign guide to group
POST /api/assignments/guide/group
Body: {
  student_ids: ["20221ISE0092", "20221ISE0093"],
  guide_id: "68e0c91300afd9788a4a9859"
}

// Assign guide to single student
POST /api/assignments/guide
Body: {
  student_id: "20221ISE0092",
  project_id: "PROJECT_ID",
  guide_id: "GUIDE_ID" // optional, auto-selects if not provided
}
```

### Project Review

```javascript
// Review/grade project
PUT /api/projects/:projectId/review
Body: {
  marks: 85,
  feedback: "Excellent work!",
  approval_status: "approved" // or "rejected", "needs_revision", "pending"
}
```

### Student Queries

```javascript
// Get guide for student
GET /api/students/:studentId/guide

// Get coordinator for student
GET /api/students/:studentId/coordinator
```

### Guide Dashboard

```javascript
// Get students assigned to guide
GET /api/guides/:guideId/students

// Get projects for guide
GET /api/guides/:guideId/projects
```

### Coordinator Dashboard

```javascript
// Get students monitored by coordinator
GET /api/coordinators/:coordId/students
```

## ✅ Verification Checklist

After setup, verify:

- [ ] Database is clean (no sample projects)
- [ ] Server is running without errors
- [ ] Frontend is built and accessible
- [ ] Student can submit project
- [ ] Admin can assign guide
- [ ] Guide appears in student dashboard
- [ ] Guide can review project
- [ ] Guide can assign marks
- [ ] Guide can edit project
- [ ] Guide can delete project
- [ ] Coordinator can view (but not modify)
- [ ] All changes persist after refresh

## 🐛 Troubleshooting

### Issue: "Student already has a project submitted"

**Solution:** Each student can only submit one project. To submit a new one:
```bash
# Delete existing project
mongo
use pg_dissertation_db
db.topics.deleteOne({ student_id: "STUDENT_ID" })
```

### Issue: Guide not showing in student panel

**Check:**
1. Server console for [DEBUG] messages
2. Project has `guide_id` field:
   ```bash
   db.topics.findOne({ student_id: "STUDENT_ID" })
   ```
3. Guide exists in users collection:
   ```bash
   db.users.findOne({ _id: ObjectId("GUIDE_ID") })
   ```

### Issue: Cannot assign guide

**Check:**
1. Student has submitted a project
2. Guide exists and has role "guide"
3. Server console for errors

### Issue: Marks not saving

**Check:**
1. Marks are between 0-100
2. Project ID is valid
3. Server console for errors

## 📊 Database Schema

### topics Collection (Projects)

```javascript
{
  _id: ObjectId,
  student_id: String,  // Student's ID
  title: String,
  description: String,
  specialization: String,
  keywords: Array,
  status: String,  // "in_progress", "approved", "rejected", "needs_revision"
  approval_status: String,  // "pending", "approved", "rejected", "needs_revision"
  marks: Number,  // 0-100 or null
  feedback: String,
  guide_id: String,  // Guide's ObjectId as string
  coordinator_id: String,  // Coordinator's ObjectId as string
  submitted_at: Date,
  created_at: Date,
  updated_at: Date
}
```

### guide_assignments Collection

```javascript
{
  _id: ObjectId,
  student_id: String,
  project_id: String,
  guide_id: String,
  assigned_at: Date,
  assignment_reason: String,
  status: String  // "active"
}
```

## 🎉 Success Indicators

When everything is working:

1. **Student submits project** → Saved to database
2. **Admin assigns guide** → `guide_id` added to project
3. **Student refreshes** → Guide details appear
4. **Guide reviews** → Marks and feedback saved
5. **Student sees marks** → Displayed in dashboard
6. **Guide deletes project** → Removed from database
7. **All changes persist** → Survive page refreshes

## 📞 Support

If issues persist:

1. Run diagnostic: `node fix-guide-assignments.js`
2. Check server logs for errors
3. Verify database state with MongoDB shell
4. Review `TROUBLESHOOTING_GUIDE.md`
5. Check `CURRENT_ISSUE_FIX.md`

---

**System Status:** ✅ Fully Functional  
**Last Updated:** 2025-10-11  
**Version:** 1.0 Final
