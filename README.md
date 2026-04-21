<<<<<<< HEAD
# PG Dissertation Management System

A comprehensive web-based platform for managing postgraduate dissertation projects, from topic submission to final publication.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd PG_Dissertation_System-main
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
# Copy environment template
cp .env.example .env

# Edit with your configuration
nano .env
```

4. **Start the application**
```bash
# Start backend server
npm run dev

# Application will be available at:
# Frontend: http://localhost:5173
# Backend API: http://localhost:3001/api
```

## 🎯 Features

### User Management
- Multi-role authentication (Student, Guide, Coordinator, Admin)
- User registration with admin approval workflow
- Profile management and password changes

### Dissertation Management
- Topic submission and approval
- Guide assignment system
- Progress tracking with milestones
- Document management and collaboration

### Analytics & Reporting
- Real-time dashboard statistics
- Progress monitoring and alerts
- Publication tracking and management

## 🏗️ System Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

### Backend
- **Node.js** with Express
- **MongoDB** for data storage
- **JWT** for authentication
- **Bcrypt** for password hashing

## 📱 Deployment

### Production Deployment
```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Environment Variables
```env
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/pg_dissertation_db
JWT_SECRET=your-secret-key
PORT=3001
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### API Endpoints
- Authentication: `/api/authenticate`
- User Management: `/api/users`
- Topics: `/api/topics`
- Approvals: `/api/approvals`
- Progress: `/api/progress`

## 📚 Documentation

- **System Architecture**: `SYSTEM_ARCHITECTURE.md`
- **API Reference**: Available in-server documentation
- **Component Documentation**: Available in-code comments

## 🛠️ Troubleshooting

### Common Issues
1. **Port conflicts**: Ensure ports 3001 and 5173 are available
2. **Database connection**: Check MongoDB is running
3. **Authentication errors**: Verify JWT_SECRET is configured

### Support
For technical support and issues, refer to the system documentation or contact the development team.

---

**Ready for production deployment! 🚀**
=======
PG Dissertation Management System

A comprehensive web application designed to streamline the entire lifecycle of postgraduate dissertations. It provides a collaborative platform for students, guides, coordinators, and administrators to manage dissertation topics, track progress, handle approvals, and manage publications efficiently.

✨ Key Features

This system is built with role-based access control, providing tailored functionality for each user type.

🔐 Authentication: Secure login system for all users.

👤 Role-Based Dashboards: Customized views and actions for Students, Guides, Coordinators, and Admins.

📚 Topic Management:

Students can create, edit, and submit dissertation topics.
Guides and Admins can review, approve, or reject topics.
Centralized list to view all topics with filtering and search capabilities.

🤝 Guide & Coordinator Allocation:

Admins can allocate guides and co-guides to students/topics.
Admins can perform group-based guide allocations.
Admins can assign coordinators.

✅ Approval Workflows:

Multi-step approval process for new user registrations.
Workflow for topic and project stage approvals.
📊 Progress Tracking: Students and guides can track the dissertation progress through various defined stages.
📄 Publication Management: A dedicated module to manage research publications associated with the dissertation.
👥 User Management: Admins can view and manage all users within the system.
⬇️ Data Export: Export topic lists to CSV and generate individual topic reports.

Review & Analytics:

Guides can review project progress.
A placeholder for future analytics and reporting features.

🛠️ Tech Stack

Frontend: React, TypeScript
Styling: Tailwind CSS
Icons: Lucide React
State Management: React Hooks (useState, useEffect, custom hooks)
>>>>>>> 26bb3f704dad230e7b65313b4df601f66a4c732a
