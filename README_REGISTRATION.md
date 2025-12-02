# PG Dissertation System - User Registration Implementation

## Overview

This implementation adds a complete user registration system for missing users in the PG Dissertation Management System. The system allows new users to register, stores their information in a pending state, and requires admin approval before they can access the system.

## Features Implemented

### ✅ **Registration System Components**
- **LoginForm Enhancement**: Added registration link for users without accounts
- **PendingRegistration Component**: Collects user information (name, email, department, specialization, phone)
- **AdminApproval Component**: Admin interface for approving/rejecting registration requests
- **MongoDB Integration**: Database storage for users, pending registrations, and topics

### ✅ **User Registration Workflow**
1. User attempts to login with non-existent credentials
2. System detects missing user and shows registration form
3. User fills out registration form with required information
4. Registration request is stored in pending state
5. Admin reviews and approves/rejects the request
6. Approved users can then login with their credentials

### ✅ **Database Structure**
- **Users Collection**: Stores approved users with roles and permissions
- **Pending Users Collection**: Stores registration requests awaiting approval
- **Topics Collection**: Stores student projects and research topics
- **Guide Assignments Collection**: Manages student-guide relationships

## Setup Instructions

### 1. Environment Setup

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017
# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pg_dissertation_db
```

### 2. Install Dependencies

```bash
npm install mongodb @types/mongodb
```

### 3. Initialize Database

Run the database initialization script:

```bash
node src/scripts/initDatabase.mjs
```

This will:
- Create the necessary collections
- Set up database indexes
- Add sample users for testing

### 4. Start the Application

```bash
npm run dev
```

## Testing the Registration System

### Sample User Accounts (for testing)

After running the initialization script, you can use these accounts:

| Email | Password | Role | Purpose |
|-------|----------|------|---------|
| `admin@university.edu` | `admin123` | Admin | Approve registration requests |
| `coordinator@university.edu` | `coordinator123` | Coordinator | Manage system |
| `guide@university.edu` | `guide123` | Guide | Supervise students |
| `student@university.edu` | `student123` | Student | Submit projects |
| `ethics@university.edu` | `ethics123` | Ethics Committee | Review ethics |

### Test Scenarios

#### 1. **New User Registration**
1. Go to the login page
2. Try to login with a non-existent email (e.g., `newuser@university.edu`)
3. Enter any password
4. Click "Register here" link
5. Fill out the registration form:
   - Email: `newuser@university.edu`
   - Full Name: `New User`
   - Department: `Computer Science`
   - Specialization: `Machine Learning`
   - Phone: `+1-555-0123`
   - Role: `student`
   - Student ID: `CS2024002`
6. Submit the registration

#### 2. **Admin Approval Process**
1. Login as admin (`admin@university.edu` / `admin123`)
2. Navigate to "Users" → "Manage User Approvals"
3. Review the pending registration
4. Click "Approve" to approve the user
5. The user can now login with their credentials

#### 3. **Registration Rejection**
1. Login as admin
2. Go to user approvals
3. Click "Reject" on a pending registration
4. Provide a reason for rejection
5. The user receives a rejection notification

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  full_name: String,
  role: String (enum: student, guide, coordinator, admin, ethics_committee),
  department: String,
  specialization: String,
  phone: String,
  student_id: String (optional),
  employee_id: String (optional),
  expertise: Array<String>,
  max_students: Number (for guides),
  current_students: Number,
  experience_level: String (junior, senior, expert),
  availability_status: String (available, busy, unavailable),
  created_at: Date,
  updated_at: Date
}
```

### Pending Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  full_name: String,
  department: String,
  specialization: String,
  phone: String,
  student_id: String (optional),
  employee_id: String (optional),
  requested_role: String,
  status: String (pending, approved, rejected),
  requested_at: Date,
  reviewed_at: Date (optional),
  reviewed_by: String (optional),
  rejection_reason: String (optional)
}
```

## API Functions

### Authentication
- `authenticateUser(email, password)` - Authenticate existing users
- `registerPendingUser(userData)` - Create pending registration
- `approvePendingUser(pendingUserId, adminId)` - Approve registration
- `rejectPendingUser(pendingUserId, adminId, reason)` - Reject registration

### User Management
- `getUserByEmail(email)` - Get user by email
- `getUserById(id)` - Get user by ID
- `getAllUsers()` - Get all users
- `getGuides()` - Get all guides
- `getStudents()` - Get all students
- `getPendingUsers()` - Get pending registrations

### Database Operations
- `updateUser(userId, updates)` - Update user information
- `updateUserPassword(userId, currentPassword, newPassword)` - Change password
- `deleteUser(userId)` - Delete user

## Security Features

- **Password Hashing**: Passwords are hashed before storage
- **Role-Based Access**: Different permissions for different user roles
- **Admin Approval**: All new registrations require admin approval
- **Input Validation**: Form validation for all user inputs
- **Database Indexes**: Optimized queries with proper indexing

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check if MongoDB is running locally
   - Verify the connection string in `.env`
   - Ensure network connectivity for Atlas

2. **Registration Not Working**
   - Check browser console for errors
   - Verify database collections exist
   - Check if user already exists

3. **Admin Approval Not Visible**
   - Login as admin user
   - Navigate to Users section
   - Check if pending users exist in database

### Debug Commands

```bash
# Check MongoDB connection
node src/scripts/initDatabase.mjs

# View database contents
# Use MongoDB Compass or mongo shell to inspect collections

# Check application logs
# Look at browser console and server logs
```

## Next Steps

1. **Email Notifications**: Add email notifications for registration status
2. **Password Reset**: Implement forgot password functionality
3. **User Profile Management**: Allow users to edit their profiles
4. **Advanced Role Management**: More granular permissions
5. **Audit Logging**: Track all system activities

## Support

For issues or questions about the registration system:
1. Check the troubleshooting section above
2. Review the browser console for errors
3. Verify database connectivity
4. Check that all dependencies are installed

The registration system is now fully functional and ready for use!
