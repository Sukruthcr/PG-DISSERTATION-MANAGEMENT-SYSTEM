# Debug Guide Assignment - Step by Step

## 🔍 Current Issue

**Symptom:** "Successfully assigned guide to 0 students" even though project exists

**Debug Output:**
```
[DEBUG] Getting guide for student: 20221ISE0092
[DEBUG] Project found: No
```

## 🎯 Root Cause

The `student_id` being sent to the API doesn't match the `student_id` in the project.

**Possible scenarios:**
1. Frontend sends MongoDB `_id` instead of `student_id`
2. Project has `student_id: "20221ISE0092"` but API receives different value
3. Mismatch between User.id and User.student_id

## ✅ Fixes Applied

### Fix 1: Enhanced Frontend Logging

**File:** `GroupGuideAllocation.tsx` (lines 159-164)

Now logs:
```javascript
Student: SUKRUTH C R, student_id: 20221ISE0092, id: 68e0c91300afd9788a4a9859, using: 20221ISE0092
```

This shows which ID is being sent to the API.

### Fix 2: Enhanced Backend Logging

**File:** `server.js` (lines 743-745)

Now logs:
```javascript
📋 Group allocation request received:
   Guide ID: 68e0c91300afd9788a4a9859
   Student IDs: ["20221ISE0092", "20221ISE0093"]
```

### Fix 3: Smart Student ID Lookup

**File:** `server.js` (lines 767-786)

Now tries multiple strategies:
1. Direct match: `{ student_id: "20221ISE0092" }`
2. As ObjectId: `{ student_id: ObjectId("20221ISE0092") }`
3. Lookup user first, then use their student_id

## 🚀 Testing Steps

### Step 1: Restart Server

```bash
node server.js
```

### Step 2: Open Browser Console

Press **F12** → Console tab

### Step 3: Assign Guide

1. Login as admin
2. Go to "Guide Assignments"
3. Click "Assign Guide" on AI Research Group
4. Select "Senior Guide"
5. Click "Confirm Allocation"

### Step 4: Check Frontend Console

You should see:
```
Student: SUKRUTH C R, student_id: 20221ISE0092, id: 68e0c91300afd9788a4a9859, using: 20221ISE0092
Allocating guide: {
  groupId: "group1",
  guideId: "68e0c91300afd9788a4a9859",
  studentIds: ["20221ISE0092", "20221ISE0093", "20221ISE0094"]
}
```

**Key Check:** Is `studentIds` showing the correct format?

### Step 5: Check Server Console

You should see:
```
📋 Group allocation request received:
   Guide ID: 68e0c91300afd9788a4a9859
   Student IDs: ["20221ISE0092", "20221ISE0093", "20221ISE0094"]

🔍 Looking for project with student_id: 20221ISE0092
✅ Created placeholder project for student 20221ISE0092
✅ Assigned guide to student 20221ISE0092

🔍 Looking for project with student_id: 20221ISE0093
✅ Created placeholder project for student 20221ISE0093
✅ Assigned guide to student 20221ISE0093

📊 Group assignment complete: 3/3 successful
```

### Step 6: Verify Database

```bash
mongo
use pg_dissertation_db

# Check projects
db.topics.find({ student_id: "20221ISE0092" }).pretty()

# Should show:
# {
#   student_id: "20221ISE0092",
#   title: "SUKRUTH C R's Research Project",
#   guide_id: "68e0c91300afd9788a4a9859",
#   ...
# }
```

### Step 7: Check Student Panel

1. Logout
2. Login as student (student@university.edu / password123)
3. Check "My Guide & Coordinator"

Server console should show:
```
[DEBUG] Getting guide for student: 20221ISE0092
[DEBUG] Project found: Yes (guide_id: 68e0c91300afd9788a4a9859)
[DEBUG] Guide found via ObjectId: Senior Guide
[SUCCESS] Returning guide: Senior Guide
```

## 🐛 Troubleshooting

### Issue 1: Frontend shows wrong student_id

**Check browser console for:**
```
Student: SUKRUTH C R, student_id: undefined, id: 68e0c91300afd9788a4a9859, using: 68e0c91300afd9788a4a9859
```

**Problem:** User object doesn't have `student_id` field

**Solution:** Check database:
```bash
db.users.findOne({ full_name: "SUKRUTH C R" })
```

If `student_id` is missing, add it:
```bash
db.users.updateOne(
  { full_name: "SUKRUTH C R" },
  { $set: { student_id: "20221ISE0092" } }
)
```

### Issue 2: Backend receives ObjectId instead of student_id

**Server console shows:**
```
📋 Group allocation request received:
   Student IDs: ["68e0c91300afd9788a4a9859"]
```

**Problem:** Frontend is sending MongoDB _id

**Solution:** Already fixed in code - backend now handles this by:
1. Looking up user by _id
2. Getting their student_id
3. Finding project by student_id

### Issue 3: Project exists but not found

**Server console shows:**
```
🔍 Looking for project with student_id: 20221ISE0092
   Trying as ObjectId...
   Trying to find student by _id...
Creating placeholder project for student 20221ISE0092
```

**Problem:** Project has different student_id format

**Check database:**
```bash
# Check what student_id format is in project
db.topics.findOne({ title: /Skin detection/ })

# Check what student_id is in users
db.users.findOne({ full_name: "SUKRUTH C R" })
```

**Solution:** Make them match:
```bash
# If project has wrong student_id
db.topics.updateOne(
  { title: /Skin detection/ },
  { $set: { student_id: "20221ISE0092" } }
)
```

## 📊 Expected vs Actual

### Expected Flow

```
1. Frontend: Send ["20221ISE0092"]
2. Backend: Receive ["20221ISE0092"]
3. Backend: Find project with student_id: "20221ISE0092"
4. Backend: Update project with guide_id
5. Backend: Return success (1/1)
6. Student: See guide details
```

### If Getting "0 students"

```
1. Frontend: Send ["68e0c91300afd9788a4a9859"] ❌ Wrong!
2. Backend: Receive ["68e0c91300afd9788a4a9859"]
3. Backend: Find project with student_id: "68e0c91300afd9788a4a9859" ❌ Not found!
4. Backend: Lookup user by _id ✅ Now fixed!
5. Backend: Get user.student_id = "20221ISE0092"
6. Backend: Find project with student_id: "20221ISE0092" ✅
7. Backend: Update project with guide_id
8. Backend: Return success (1/1) ✅
```

## ✅ Success Checklist

After restart and test:

- [ ] Frontend console shows correct student_id
- [ ] Server receives correct student_id array
- [ ] Server finds existing project OR creates placeholder
- [ ] Server logs "✅ Assigned guide to student..."
- [ ] Server logs "📊 Group assignment complete: 3/3 successful"
- [ ] Alert shows "Successfully assigned guide to 3 student(s)"
- [ ] Student panel shows guide details
- [ ] Server logs "[SUCCESS] Returning guide: Senior Guide"

## 🎯 Quick Commands

**Restart server:**
```bash
node server.js
```

**Check database:**
```bash
mongo
use pg_dissertation_db
db.users.find({ role: "student" }, { full_name: 1, student_id: 1, _id: 1 }).pretty()
db.topics.find({}, { student_id: 1, title: 1, guide_id: 1 }).pretty()
```

**Clear and retry:**
```bash
# In mongo shell
db.topics.deleteMany({})
db.guide_assignments.deleteMany({})
```

Then restart server and try again.

---

**Status:** Enhanced with comprehensive logging  
**Action:** Restart server and check console outputs  
**Expected:** Clear visibility into what's happening at each step
