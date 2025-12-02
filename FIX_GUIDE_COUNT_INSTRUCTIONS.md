# Fix Guide Student Load Count - Instructions

## Problem
The guide student load count shows 0/5 after page reload, even though students have been assigned.

## Root Cause
1. The server was counting total assignments instead of unique students
2. Duplicate assignments were being created
3. **The server needs to be restarted to apply the code changes**

## Solution Applied

### Files Modified:
1. **server.js** - Updated to:
   - Count unique students instead of total assignments
   - Prevent duplicate assignments from being created
   
2. **cleanup-duplicate-assignments.js** - Script to remove existing duplicates

## IMPORTANT: Steps to Apply the Fix

### Step 1: Stop the Current Server
If the server is running, stop it by pressing `Ctrl+C` in the terminal where it's running.

### Step 2: Clean Up Duplicate Assignments
Run the cleanup script:
```bash
node cleanup-duplicate-assignments.js
```

This will remove any duplicate assignments from the database.

### Step 3: Restart the Server
Start the server with the updated code:
```bash
node server.js
```

### Step 4: Verify the Fix
1. Open your application in the browser
2. Navigate to the Guide Allocation page
3. Check that the guide shows the correct student count (e.g., 2/5)
4. Reload the page
5. Verify the count still shows correctly (e.g., 2/5)

## What Changed

### Before:
- Guide count: 0/5 (incorrect)
- After reload: 0/5 (data appeared lost)
- Duplicate assignments created on each allocation

### After:
- Guide count: 2/5 (correct - based on actual assignments)
- After reload: 2/5 (persists correctly)
- No duplicates created

## Technical Details

### Server Changes (server.js):

**Lines 137-149** - `/api/users` endpoint:
```javascript
// Now counts unique students
const uniqueStudents = await db.collection('guide_assignments').distinct('student_id', {
  guide_id: userId,
  status: 'active'
});
currentStudents = uniqueStudents.length;
```

**Lines 183-192** - `/api/users/guides` endpoint:
```javascript
// Same change for guides endpoint
const uniqueStudents = await db.collection('guide_assignments').distinct('student_id', {
  guide_id: guideId,
  status: 'active'
});
const assignmentCount = uniqueStudents.length;
```

**Lines 864-887** - Group allocation:
```javascript
// Check if assignment already exists before creating
const existingAssignment = await db.collection('guide_assignments').findOne({
  student_id,
  guide_id,
  status: 'active'
});

if (!existingAssignment) {
  // Only create if doesn't exist
  await db.collection('guide_assignments').insertOne(assignment);
}
```

## Verification

After restarting the server, you can verify the fix is working:

1. Check database directly:
```bash
node -e "const { MongoClient } = require('mongodb'); (async () => { const client = new MongoClient('mongodb://localhost:27017'); await client.connect(); const db = client.db('pg_dissertation_db'); const guides = await db.collection('users').find({ role: 'guide' }).toArray(); for (const guide of guides) { const uniqueStudents = await db.collection('guide_assignments').distinct('student_id', { guide_id: guide._id.toString(), status: 'active' }); console.log(guide.full_name + ':', uniqueStudents.length, 'students'); } await client.close(); })()"
```

2. Test API endpoint (after server restart):
```bash
curl http://localhost:3001/api/users/guides
```

The `current_students` field should show the correct count.

## Troubleshooting

### If count still shows 0:
1. **Make sure the server was restarted** - The old code is still running if you didn't restart
2. Run the cleanup script again to remove duplicates
3. Check server console for errors
4. Verify assignments exist in database using the verification command above

### If duplicates keep appearing:
- This means the old server code is still running
- Stop the server completely and restart it

## Summary
✅ Server code updated to count unique students
✅ Server code updated to prevent duplicates
✅ Cleanup script created to remove existing duplicates
⚠️ **YOU MUST RESTART THE SERVER** for changes to take effect
