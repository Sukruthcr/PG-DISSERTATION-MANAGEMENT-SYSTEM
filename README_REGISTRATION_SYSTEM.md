# PG Dissertation System - User Registration System

## Overview

This document describes the complete user registration system implementation for the PG Dissertation Management System. The system allows new users to register, stores their requests in a pending state, and requires admin approval before granting access.

## Features

### 🔐 User Registration Workflow
- **Registration Form**: Collects user information (name, email, department, specialization, phone)
- **Pending State**: New registrations are stored in pending status
- **Admin Approval**: Administrators can approve or reject registration requests
- **Automatic User Creation**: Approved users are automatically added to the main user database
- **Email Notifications**: System tracks approval/rejection status

### 🛡️ Security Features
- **Role-based Access**: Different user roles (student, guide, coordinator, admin, etc.)
- **Secure Authentication**: Password-based login system
- **Admin-only Approval**: Only administrators can approve new users
- **Duplicate Prevention**: Prevents duplicate email registrations

## System Architecture

### Database Structure

#### Users Table
```javascript
{
  id: string,
  email: string,
  full_name: string,
  role: 'student' | 'guide' | 'coordinator' | 'admin' | 'ethics_committee',
  department: string,
  specialization: string,
  phone: string,
  student_id?: string,      // For students
  employee_id?: string,     // For staff
  created_at: string,
  updated_at: string
}
```

#### Pending Users Table
```javascript
{
  id: string,
  email: string,
  full_name: string,
  department: string,
  specialization: string,
  phone: string,
  student_id?: string,
  employee_id?: string,
  requested_role: 'student' | 'guide' | 'coordinator' | 'admin' | 'ethics_committee',
  status: 'pending' | 'approved' | 'rejected',
  requested_at: string,
  reviewed_at?: string,
  reviewed_by?: string,
  rejection_reason?: string
}
```

## Implementation Details

### 1. Login Form Enhancement (`src/components/LoginForm.tsx`)

The login form now includes:
- **Registration Link**: "Don't have an account? Register here" button
- **Registration Modal**: Opens when user clicks register or when login fails due to missing user
- **Error Handling**: Detects when user needs to register vs. wrong password

### 2. Registration Component (`src/components/PendingRegistration.tsx`)

Features:
- **Form Validation**: Email format, required fields, password matching
- **Role-specific Fields**: Student ID for students, Employee ID for staff
- **Real-time Feedback**: Shows registration process information
- **Success Handling**: Provides clear next steps after submission

### 3. Admin Approval Component (`src/components/AdminApproval.tsx`)

Capabilities:
- **Pending Users List**: View all registration requests
- **User Details**: Review complete user information
- **Approval/Rejection**: One-click approve or reject with reason
- **Status Tracking**: Track approval history and reasons

### 4. Database Service (`src/services/simpleDatabaseService.ts`)

Functions:
- `authenticateUser()`: Handles login with registration detection
- `registerPendingUser()`: Creates new pending registration
- `approvePendingUser()`: Converts pending user to active user
- `rejectPendingUser()`: Rejects registration with reason
- `getPendingUsers()`: Retrieves all pending registrations

## Testing

### Test Results ✅

The registration system has been thoroughly tested:

1. **Authentication Test**: Non-existent users correctly trigger registration flow
2. **Registration Test**: New users successfully create pending registrations
3. **Pending List Test**: Pending users appear in admin interface
4. **Approval Test**: Admin approval successfully creates active users
5. **Final Authentication Test**: Approved users can log in with default password

### Sample Test Data

The system includes sample users for testing:
- **Admin**: admin@university.edu (password: admin123)
- **Coordinator**: coordinator@university.edu (password: coordinator123)
- **Guide**: guide@university.edu (password: guide123)
- **Student**: student@university.edu (password: student123)
- **Ethics Committee**: ethics@university.edu (password: ethics123)

## Usage Guide

### For New Users:
1. Visit the login page
2. Click "Register here" or try to log in with non-existent email
3. Fill out the registration form with all required information
4. Submit the form
5. Wait for admin approval notification
6. Once approved, log in with email and default password (default123)

### For Administrators:
1. Log in as admin
2. Navigate to Admin Approval section
3. Review pending registration requests
4. Click "Approve" or "Reject" for each request
5. Provide rejection reason if rejecting
6. Approved users can immediately log in

## File Structure

```
src/
├── components/
│   ├── LoginForm.tsx              # Enhanced login with registration
│   ├── PendingRegistration.tsx    # Registration form component
│   ├── AdminApproval.tsx          # Admin approval interface
│   └── UserRegistration.tsx       # Legacy registration component
├── services/
│   ├── simpleDatabaseService.ts   # In-memory database service
│   ├── simpleDatabaseService.js   # JavaScript version for testing
│   └── databaseServiceNew.ts      # New database service wrapper
└── types/
    └── index.ts                   # TypeScript type definitions
```

## Security Considerations

1. **Password Security**: In production, implement proper password hashing
2. **Email Verification**: Consider adding email verification for new registrations
3. **Rate Limiting**: Implement rate limiting for registration attempts
4. **Input Validation**: All inputs are validated on both client and server side
5. **Role Validation**: User roles are strictly enforced throughout the system

## Future Enhancements

1. **Email Notifications**: Send approval/rejection emails to users
2. **Password Reset**: Implement forgot password functionality
3. **Profile Management**: Allow users to update their profiles
4. **Audit Logging**: Track all registration and approval activities
5. **Bulk Operations**: Allow admins to approve/reject multiple users at once

## Troubleshooting

### Common Issues:

1. **Registration Not Working**:
   - Check browser console for JavaScript errors
   - Verify all required fields are filled
   - Ensure email format is valid

2. **Admin Approval Not Visible**:
   - Log in as admin user
   - Check if pending users exist in the system
   - Verify admin role permissions

3. **Login After Approval Fails**:
   - Use the default password (default123)
   - Check if user was actually approved
   - Verify email address is correct

## Support

For technical support or questions about the registration system, contact the development team or refer to the main system documentation.

---

**Last Updated**: September 20, 2025
**Version**: 1.0.0
**Status**: ✅ Fully Functional
