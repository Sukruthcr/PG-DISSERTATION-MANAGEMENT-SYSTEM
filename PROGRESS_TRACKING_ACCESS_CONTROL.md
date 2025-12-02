# Progress Tracking Access Control Implementation

## Overview
Implemented comprehensive access control for the progress tracking system to ensure that only assigned guides can view and interact with student progress submissions.

## Security Requirements Implemented

### ✅ Access Restrictions
- **Assigned Guide Only**: Only the guide officially assigned to a student can view their progress
- **Student Access**: Students can only view their own progress
- **Admin/Coordinator Access**: Full access to all progress tracking data
- **Access Denial UI**: Clear messaging when access is denied

## Changes Made

### 1. Backend API Access Control (server.js)

#### GET `/api/topics/:topicId/milestones`
**Added Query Parameters:**
- `userId` - The ID of the user making the request
- `userRole` - The role of the user (student, guide, admin, coordinator)

**Access Control Logic:**
```javascript
// For guides: Check if guide_id or co_guide_id matches userId
const isAssignedGuide = topic.guide_id === userId || topic.co_guide_id === userId;

// For students: Check if student_id matches userId (handles both student_id and _id)
let isOwnProject = topic.student_id === userId;
// If not matched, try to find the user by _id and compare student_id
if (!isOwnProject && ObjectId.isValid(userId)) {
  const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
  if (user && user.student_id) {
    isOwnProject = topic.student_id === user.student_id;
  }
  // Also check if topic.student_id is the user's _id
  if (!isOwnProject) {
    isOwnProject = topic.student_id === user._id.toString();
  }
}

// Admin/Coordinator: Full access (no restrictions)
```

**Response on Access Denial:**
```json
{
  "success": false,
  "message": "Access denied. You are not assigned as the guide for this student.",
  "accessDenied": true
}
```

#### PUT `/api/milestones/:milestoneId/feedback`
**Added Request Body Parameters:**
- `userId` - The ID of the guide providing feedback
- `userRole` - The role of the user

**Access Control:**
- Fetches the milestone to get its `topic_id`
- Fetches the topic to check `guide_id` and `co_guide_id`
- Only allows assigned guides to provide feedback
- Returns 403 Forbidden if not assigned

#### PUT `/api/milestones/:milestoneId/approve`
**Added Request Body Parameters:**
- `userId` - The ID of the guide approving
- `userRole` - The role of the user

**Access Control:**
- Fetches the milestone to get its `topic_id`
- Fetches the topic to check `guide_id` and `co_guide_id`
- Only allows assigned guides to approve milestones
- Returns 403 Forbidden if not assigned

### 2. Frontend Component Updates

#### ProgressTracker.tsx

**New Props:**
```typescript
interface ProgressTrackerProps {
  topicId: string;
  userRole: string;
  userId: string;  // NEW: User ID for access control
}
```

**New State Variables:**
```typescript
const [accessDenied, setAccessDenied] = useState(false);
const [accessMessage, setAccessMessage] = useState('');
```

**Access Control Handling:**
- Passes `userId` and `userRole` as query parameters when fetching milestones
- Detects 403 status code and displays access denial UI
- Passes `userId` and `userRole` in request body for feedback and approval operations

**Access Denied UI:**
```tsx
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
  <div className="text-center">
    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
      {/* Warning Icon */}
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
    <p className="text-gray-600 mb-4">{accessMessage}</p>
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
      <p className="text-sm text-yellow-800">
        <strong>Note:</strong> Progress tracking is restricted to assigned guides only. 
        If you believe you should have access, please contact the administrator.
      </p>
    </div>
  </div>
</div>
```

#### App.tsx

**Updated Progress View:**
```typescript
case 'progress':
  return (
    <ProgressTracker 
      topicId={userTopicId} 
      userRole={user?.role || 'student'} 
      userId={user?.id || ''}  // NEW: Pass user ID
    />
  );
```

## Access Control Flow

### Scenario 1: Assigned Guide Views Student Progress
```
1. Guide clicks on student's project
2. Frontend sends: GET /api/topics/{topicId}/milestones?userId={guideId}&userRole=guide
3. Backend checks: topic.guide_id === guideId OR topic.co_guide_id === guideId
4. Result: ✅ Access granted, milestones returned
5. UI displays: Full progress tracking interface with review capabilities
```

### Scenario 2: Unassigned Guide Attempts to View Progress
```
1. Guide tries to access another guide's student progress
2. Frontend sends: GET /api/topics/{topicId}/milestones?userId={guideId}&userRole=guide
3. Backend checks: topic.guide_id !== guideId AND topic.co_guide_id !== guideId
4. Result: ❌ Access denied (403 Forbidden)
5. UI displays: Access denied message with explanation
```

### Scenario 3: Student Views Own Progress
```
1. Student navigates to Progress tab
2. Frontend sends: GET /api/topics/{topicId}/milestones?userId={studentId}&userRole=student
3. Backend checks: topic.student_id === studentId
4. Result: ✅ Access granted, milestones returned
5. UI displays: Progress tracking with upload capabilities
```

### Scenario 4: Admin/Coordinator Views Any Progress
```
1. Admin navigates to any student's progress
2. Frontend sends: GET /api/topics/{topicId}/milestones?userId={adminId}&userRole=admin
3. Backend checks: userRole === 'admin' or 'coordinator'
4. Result: ✅ Access granted (no restrictions)
5. UI displays: Full progress tracking interface
```

## Security Benefits

### 🔒 Privacy Protection
- Student progress is only visible to their assigned guide
- Prevents unauthorized access to sensitive academic data
- Maintains confidentiality between guide-student relationships

### 🎯 Proper Workflow Control
- Ensures only responsible guide can provide feedback
- Prevents confusion from multiple guides reviewing same work
- Maintains clear accountability chain

### ✅ Role-Based Access Control (RBAC)
- Student: Own progress only
- Guide: Assigned students only
- Admin/Coordinator: All students
- Clear separation of concerns

### 🛡️ Data Integrity
- Only assigned guide can approve milestones
- Only assigned guide can provide grades and feedback
- Prevents unauthorized modifications

## Testing Scenarios

### Test 1: Assigned Guide Access
1. Login as Guide A (assigned to Student X)
2. Navigate to Student X's progress
3. **Expected**: Full access to view, review, and approve milestones

### Test 2: Unassigned Guide Access
1. Login as Guide B (NOT assigned to Student X)
2. Try to access Student X's progress
3. **Expected**: "Access Denied" message displayed

### Test 3: Student Own Progress
1. Login as Student X
2. Navigate to Progress tab
3. **Expected**: Can view and upload to own milestones

### Test 4: Student Other Progress
1. Login as Student X
2. Try to access Student Y's progress (if possible via URL manipulation)
3. **Expected**: "Access Denied" message displayed

### Test 5: Admin Full Access
1. Login as Admin
2. Navigate to any student's progress
3. **Expected**: Full access to all students' progress

### Test 6: Feedback Authorization
1. Login as unassigned Guide B
2. Try to submit feedback via API (if possible)
3. **Expected**: 403 Forbidden error

### Test 7: Approval Authorization
1. Login as unassigned Guide B
2. Try to approve milestone via API (if possible)
3. **Expected**: 403 Forbidden error

## API Endpoints Summary

| Endpoint | Method | Access Control | Returns on Denial |
|----------|--------|----------------|-------------------|
| `/api/topics/:topicId/milestones` | GET | Student (own), Assigned Guide, Admin | 403 + message |
| `/api/milestones/:milestoneId/feedback` | PUT | Assigned Guide, Admin | 403 + message |
| `/api/milestones/:milestoneId/approve` | PUT | Assigned Guide, Admin | 403 + message |
| `/api/milestones/:milestoneId/documents` | POST | Student (own), Admin | No change (existing) |
| `/api/milestones/:milestoneId/documents/:docId` | DELETE | Student (own), Admin | No change (existing) |

## Database Schema (No Changes)

The existing schema already supports access control through the `guide_id` field in the topics collection:

```javascript
// topics collection
{
  _id: ObjectId,
  student_id: String,
  guide_id: String,      // Used for access control
  co_guide_id: String,   // Used for access control
  // ... other fields
}

// milestones collection
{
  _id: ObjectId,
  topic_id: String,  // Links to topics for access control
  // ... other fields
}
```

## Error Messages

### Access Denied (Guide)
```
"Access denied. You are not assigned as the guide for this student."
```

### Access Denied (Student)
```
"Access denied. You can only view your own progress."
```

### Project Not Found
```
"Project not found"
```

## Future Enhancements

### Potential Improvements
1. **Audit Logging**: Log all access attempts (successful and denied)
2. **Email Notifications**: Notify admin when access is denied
3. **Temporary Access**: Allow admin to grant temporary access to other guides
4. **Co-Guide Permissions**: Fine-grained permissions for co-guides
5. **Read-Only Access**: Allow coordinators to grant read-only access to other guides

### Security Hardening
1. **Rate Limiting**: Prevent brute force access attempts
2. **Session Validation**: Verify user session on each request
3. **IP Whitelisting**: Restrict access from specific IP ranges
4. **Two-Factor Authentication**: For sensitive operations like approval

## Notes

- Access control is enforced at the API level (backend)
- Frontend UI provides user-friendly feedback
- Admin and coordinator roles bypass all restrictions
- Co-guides have same access as primary guides
- Student can only access their own progress
- All access control checks happen before data retrieval
- 403 Forbidden status code used for access denial
- Clear error messages guide users on why access was denied

## Compatibility

- ✅ Works with existing guide assignment system
- ✅ Compatible with group guide allocation
- ✅ Supports co-guide assignments
- ✅ No database schema changes required
- ✅ Backward compatible with existing data

## Bug Fixes

### Student Access Issue (Fixed)
**Problem**: Students were receiving "Access denied. You can only view your own progress" error when trying to view their own progress.

**Root Cause**: The access control logic was comparing `topic.student_id` with `userId`, but:
- `userId` from frontend is the user's MongoDB `_id` (e.g., "507f1f77bcf86cd799439011")
- `topic.student_id` could be either the `student_id` field (e.g., "S001") OR the user's `_id`
- This mismatch caused the comparison to fail

**Solution**: Enhanced the student access control logic to:
1. First try direct comparison: `topic.student_id === userId`
2. If no match and userId is a valid ObjectId, look up the user document
3. Compare `topic.student_id` with the user's `student_id` field
4. Also check if `topic.student_id` matches the user's `_id.toString()`

This ensures students can access their progress regardless of which identifier was used when creating the project.
