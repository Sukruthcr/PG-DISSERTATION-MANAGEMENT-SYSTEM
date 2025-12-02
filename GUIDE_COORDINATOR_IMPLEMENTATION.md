# Guide & Coordinator Assignment Implementation

## ✅ Completed Features

### 1. Backend APIs (server.js)

#### Guide Assignment
- **POST `/api/assignments/guide`** - Assign guide to student project
  - Auto-selects guide if `guide_id` not provided (matches specialization)
  - Prevents duplicate assignments (returns existing if already assigned)
  - Logs assignment in `guide_assignments` collection
  
#### Coordinator Assignment
- **POST `/api/assignments/coordinator`** - Assign coordinator to student project
  - Logs assignment in `coordinator_assignments` collection

#### Guide Dashboard APIs
- **GET `/api/guides/:guideId/students`** - List all students assigned to guide with project details
- **GET `/api/guides/:guideId/projects`** - Get all projects for guide review
- **PUT `/api/projects/:projectId/review`** - Submit marks, feedback, approval status
- **DELETE `/api/projects/:projectId`** - Delete project (guide permission)

#### Coordinator Dashboard APIs
- **GET `/api/coordinators/:coordId/students`** - List students for monitoring (read-only)

#### Student Dashboard APIs
- **GET `/api/students/:studentId/guide`** - Get assigned guide details
- **GET `/api/students/:studentId/coordinator`** - Get assigned coordinator details

#### Enhanced Project Data
- **GET `/api/student-projects`** now includes:
  - `status`, `guide_id`, `coordinator_id`
  - `marks`, `feedback`, `approval_status`
  - `submitted_at`

### 2. Frontend Services (src/services/databaseService.ts)

New functions added:
```typescript
allocateGuideToStudent(studentId, projectId, guideId?)
allocateCoordinatorToStudent(studentId, projectId, coordinatorId)
getGuideForStudent(studentId)
getCoordinatorForStudent(studentId)
getProjectsForGuide(guideId)
reviewProject(projectId, { marks, feedback, approval_status })
deleteProject(projectId)
getStudentsForCoordinator(coordinatorId)
```

### 3. Student Dashboard (src/components/Dashboard/MyGuide.tsx)

**Features:**
- Displays assigned guide details (name, email, department, specialization)
- Displays assigned coordinator details
- Real-time data from backend APIs
- Shows "No guide assigned" if not yet allocated

**Usage:**
```tsx
<MyGuide studentId={user.student_id || user.id} />
```

### 4. Guide Dashboard (src/components/Dashboard/GuideDashboard.tsx)

**Features:**
- Lists all students assigned to the guide
- Shows project title, description, status, marks, approval status
- **Review Action**: Opens modal to:
  - Assign marks (0-100)
  - Set approval status (pending/approved/needs_revision/rejected)
  - Provide feedback
- **Delete Action**: Removes project with confirmation
- Changes reflect immediately in student dashboard

**Usage:**
```tsx
<GuideDashboard guideId={user.id} guideName={user.full_name} />
```

**Integrated in:** `src/components/Dashboard/Dashboard.tsx` for users with `role === 'guide'`

### 5. Coordinator Panel (src/components/Dashboard/CoordinatorPanel.tsx)

**Features:**
- Lists all students assigned for monitoring
- Shows project status and approval status (read-only)
- Progress summary statistics
- **No permissions** for marks allocation or project deletion
- Visual status indicators

**Usage:**
```tsx
<CoordinatorPanel coordinatorId={user.id} coordinatorName={user.full_name} />
```

**Integrated in:** `src/components/Dashboard/Dashboard.tsx` for users with `role === 'coordinator'`

### 6. Guide Allocation Fix (src/components/GuideAllocation.tsx)

**Bug Fixed:**
- Previously used `getStudentGuideAssignments()` which returned empty array
- Now derives assignments from `projects` that have `guide_id` field
- Backend checks for existing assignment before creating new one
- Assignments persist across page refreshes

**How it works:**
1. Admin clicks "Assign Guide" in allocation panel
2. Backend checks if project already has `guide_id`
3. If yes, returns existing assignment
4. If no, auto-selects guide based on specialization match
5. Updates project with `guide_id` and logs in `guide_assignments`
6. Frontend reloads and shows assignment in "Assigned Projects" section

### 7. Project Review (src/components/Projects/ProjectReview.tsx)

**Enhanced Features:**
- Loads projects via `getProjectsForGuide(guideId)`
- Submit review updates backend immediately
- Delete button with confirmation
- Changes propagate to student dashboard instantly

## 🔄 Data Flow

### Guide Assignment Flow
```
Admin Panel (GuideAllocation.tsx)
  ↓ allocateGuideToStudent(studentId, projectId)
Backend (/api/assignments/guide)
  ↓ Updates topics.guide_id
  ↓ Logs in guide_assignments
Database (MongoDB)
  ↓ Persisted
Guide Dashboard (GuideDashboard.tsx)
  ↓ getAssignmentsForGuide(guideId)
  ↓ Shows assigned students
Student Dashboard (MyGuide.tsx)
  ↓ getGuideForStudent(studentId)
  ↓ Shows guide details
```

### Coordinator Assignment Flow
```
Admin Panel
  ↓ allocateCoordinatorToStudent(studentId, projectId, coordinatorId)
Backend (/api/assignments/coordinator)
  ↓ Updates topics.coordinator_id
  ↓ Logs in coordinator_assignments
Database (MongoDB)
  ↓ Persisted
Coordinator Panel (CoordinatorPanel.tsx)
  ↓ Shows assigned students (read-only)
Student Dashboard (MyGuide.tsx)
  ↓ Shows coordinator details
```

### Project Review Flow
```
Guide Dashboard
  ↓ Click "Review" on student project
Review Modal
  ↓ Enter marks, feedback, approval status
  ↓ reviewProject(projectId, payload)
Backend (/api/projects/:projectId/review)
  ↓ Updates topics collection
Database (MongoDB)
  ↓ Persisted
Student Dashboard
  ↓ Refreshes → sees updated marks/status
Coordinator Panel
  ↓ Refreshes → sees updated status
```

## 📋 How to Use

### For Admins

1. **Assign Guide to Student:**
   - Navigate to "Guide Assignments" section
   - Click "Assign Guide" on unassigned project
   - System auto-selects best guide based on specialization
   - Assignment persists and appears in "Assigned Projects"

2. **Assign Coordinator:**
   - Use `allocateCoordinatorToStudent()` API
   - Example: Call from admin panel with student, project, and coordinator IDs

### For Guides

1. **View Assigned Students:**
   - Login as guide
   - Dashboard automatically shows `GuideDashboard` component
   - See list of all assigned students with project details

2. **Review Project:**
   - Click "Review" button on any student
   - Enter marks (0-100)
   - Select approval status
   - Provide feedback
   - Click "Submit Review"
   - Changes visible immediately to student

3. **Delete Project:**
   - Click "Delete" button
   - Confirm deletion
   - Project removed from database

### For Coordinators

1. **Monitor Students:**
   - Login as coordinator
   - Dashboard shows `CoordinatorPanel` component
   - View all assigned students and project status
   - See progress summary statistics
   - **Cannot** assign marks or delete projects

### For Students

1. **View Assigned Guide:**
   - Login as student
   - Dashboard shows `MyGuide` component
   - See guide name, email, department, specialization
   - See coordinator details (if assigned)
   - View marks and approval status (updated in real-time)

## 🗄️ Database Schema

### Collections

**topics** (projects):
```javascript
{
  _id: ObjectId,
  student_id: String,
  title: String,
  description: String,
  specialization: String,
  status: String, // 'in_progress', 'approved', 'rejected', 'needs_revision'
  guide_id: String, // Reference to users._id
  coordinator_id: String, // Reference to users._id
  marks: Number, // 0-100
  feedback: String,
  approval_status: String, // 'pending', 'approved', 'rejected', 'needs_revision'
  submitted_at: Date,
  created_at: Date,
  updated_at: Date
}
```

**guide_assignments**:
```javascript
{
  _id: ObjectId,
  student_id: String,
  project_id: String,
  guide_id: String,
  assigned_at: Date,
  assignment_reason: String,
  status: String // 'active', 'inactive', 'completed'
}
```

**coordinator_assignments**:
```javascript
{
  _id: ObjectId,
  student_id: String,
  project_id: String,
  coordinator_id: String,
  assigned_at: Date,
  status: String // 'active', 'inactive', 'completed'
}
```

## 🐛 Bug Fixes

### Guide Allocation Persistence Issue

**Problem:**
- Clicking "Assign Guide" multiple times showed zero guides assigned
- Previous allocations were not retained

**Root Cause:**
- `getStudentGuideAssignments()` returned empty array
- Frontend didn't derive assignments from project data

**Solution:**
1. Backend now checks for existing `guide_id` before assigning
2. Returns existing assignment if already present
3. Frontend derives assignments from projects with `guide_id`
4. Assignments persist across refreshes

**Code Changes:**
- `server.js`: Added check for existing assignment (line 673-688)
- `GuideAllocation.tsx`: Derives assignments from projects (line 54-66)

## 🚀 Testing

### Test Guide Assignment
```bash
# 1. Login as admin
# 2. Navigate to Guide Assignments
# 3. Click "Assign Guide" on a project
# 4. Verify assignment appears in "Assigned Projects"
# 5. Refresh page
# 6. Verify assignment still visible
# 7. Click "Assign Guide" again
# 8. Verify no duplicate assignment created
```

### Test Guide Dashboard
```bash
# 1. Assign guide to student project (as admin)
# 2. Login as that guide
# 3. Verify student appears in "My Assigned Students"
# 4. Click "Review" on student
# 5. Enter marks and feedback
# 6. Submit review
# 7. Verify success message
# 8. Login as student
# 9. Verify marks visible in dashboard
```

### Test Coordinator Panel
```bash
# 1. Assign coordinator to student project
# 2. Login as coordinator
# 3. Verify student appears in monitoring panel
# 4. Verify no "Review" or "Delete" buttons
# 5. Verify progress summary shows correct counts
```

### Test Project Deletion
```bash
# 1. Login as guide
# 2. Click "Delete" on a project
# 3. Confirm deletion
# 4. Verify project removed from guide dashboard
# 5. Login as student
# 6. Verify project no longer visible
```

## 📝 API Examples

### Assign Guide
```javascript
POST /api/assignments/guide
{
  "student_id": "507f1f77bcf86cd799439011",
  "project_id": "507f1f77bcf86cd799439012"
  // guide_id optional - auto-selects if omitted
}
```

### Review Project
```javascript
PUT /api/projects/507f1f77bcf86cd799439012/review
{
  "marks": 85,
  "feedback": "Excellent work on the literature review.",
  "approval_status": "approved"
}
```

### Get Guide for Student
```javascript
GET /api/students/507f1f77bcf86cd799439011/guide
// Returns guide details or null
```

## 🎯 Next Steps (Optional Enhancements)

1. **Email Notifications:**
   - Notify students when guide assigns marks
   - Notify guides when project submitted

2. **Bulk Assignment:**
   - Assign multiple students to one guide
   - Auto-distribute based on workload

3. **Assignment History:**
   - Track guide changes over time
   - Show reassignment reasons

4. **Coordinator Actions:**
   - Add comment/note capability
   - Flag projects for attention

5. **Analytics Dashboard:**
   - Guide workload distribution
   - Average marks by guide
   - Project completion rates

## 📚 File Reference

### Backend
- `server.js` - All API endpoints

### Frontend Services
- `src/services/databaseService.ts` - API client functions

### Components
- `src/components/Dashboard/Dashboard.tsx` - Main dashboard router
- `src/components/Dashboard/MyGuide.tsx` - Student view of guide/coordinator
- `src/components/Dashboard/GuideDashboard.tsx` - Guide's assigned students
- `src/components/Dashboard/CoordinatorPanel.tsx` - Coordinator monitoring
- `src/components/GuideAllocation.tsx` - Admin guide allocation
- `src/components/Projects/ProjectReview.tsx` - Guide project review

## ✅ Requirements Met

- ✅ Guide panel displays list of assigned students
- ✅ Student panel shows guide details (name, email, department)
- ✅ Guide can review assigned projects
- ✅ Guide can allocate marks
- ✅ Guide can delete projects
- ✅ Updates reflect immediately in student dashboard
- ✅ Coordinator allocation mirrors guide logic
- ✅ Coordinator can monitor student progress
- ✅ Coordinator cannot assign marks or delete
- ✅ Guide allocation persists across refreshes
- ✅ No duplicate assignments created
