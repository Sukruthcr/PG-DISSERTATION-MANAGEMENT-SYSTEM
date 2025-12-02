# System Architecture - Guide & Coordinator Management

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Student    │  │    Guide     │  │ Coordinator  │          │
│  │  Dashboard   │  │  Dashboard   │  │    Panel     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                  │                  │                  │
│         └──────────────────┴──────────────────┘                  │
│                            │                                     │
│                   ┌────────▼────────┐                           │
│                   │ Database Service │                           │
│                   │  (API Client)    │                           │
│                   └────────┬────────┘                           │
└────────────────────────────┼──────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Express API   │
                    │   (server.js)   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │    MongoDB      │
                    │   Database      │
                    └─────────────────┘
```

## 📊 Data Flow Diagrams

### 1. Guide Assignment Flow

```
┌─────────┐
│  Admin  │
└────┬────┘
     │ 1. Click "Assign Guide"
     ▼
┌─────────────────────────────┐
│  GuideAllocation Component  │
└────────────┬────────────────┘
             │ 2. allocateGuideToStudent(studentId, projectId)
             ▼
┌─────────────────────────────┐
│   databaseService.ts        │
└────────────┬────────────────┘
             │ 3. POST /api/assignments/guide
             ▼
┌─────────────────────────────┐
│      server.js              │
│  ┌──────────────────────┐   │
│  │ Check existing       │   │
│  │ assignment           │   │
│  └──────────┬───────────┘   │
│             │                │
│  ┌──────────▼───────────┐   │
│  │ Auto-select guide    │   │
│  │ (if not provided)    │   │
│  └──────────┬───────────┘   │
│             │                │
│  ┌──────────▼───────────┐   │
│  │ Update topics        │   │
│  │ collection           │   │
│  └──────────┬───────────┘   │
│             │                │
│  ┌──────────▼───────────┐   │
│  │ Log in guide_        │   │
│  │ assignments          │   │
│  └──────────────────────┘   │
└────────────┬────────────────┘
             │ 4. Return assignment
             ▼
┌─────────────────────────────┐
│     MongoDB Database        │
│  ┌──────────────────────┐   │
│  │ topics               │   │
│  │  - guide_id: "..."   │   │
│  └──────────────────────┘   │
│  ┌──────────────────────┐   │
│  │ guide_assignments    │   │
│  │  - student_id        │   │
│  │  - project_id        │   │
│  │  - guide_id          │   │
│  └──────────────────────┘   │
└─────────────────────────────┘
```

### 2. Project Review Flow

```
┌─────────┐
│  Guide  │
└────┬────┘
     │ 1. Login & View Dashboard
     ▼
┌─────────────────────────────┐
│  GuideDashboard Component   │
│  ┌──────────────────────┐   │
│  │ Load assigned        │   │
│  │ students             │   │
│  └──────────┬───────────┘   │
│             │ getAssignmentsForGuide(guideId)
│             ▼                │
│  ┌──────────────────────┐   │
│  │ Display student list │   │
│  │ with project details │   │
│  └──────────┬───────────┘   │
└─────────────┼───────────────┘
              │ 2. Click "Review"
              ▼
┌─────────────────────────────┐
│     Review Modal            │
│  ┌──────────────────────┐   │
│  │ Enter marks          │   │
│  │ Select status        │   │
│  │ Add feedback         │   │
│  └──────────┬───────────┘   │
└─────────────┼───────────────┘
              │ 3. Submit
              ▼
┌─────────────────────────────┐
│   reviewProject(projectId,  │
│     { marks, feedback,      │
│       approval_status })    │
└────────────┬────────────────┘
             │ 4. PUT /api/projects/:id/review
             ▼
┌─────────────────────────────┐
│      server.js              │
│  ┌──────────────────────┐   │
│  │ Update topics        │   │
│  │  - marks             │   │
│  │  - feedback          │   │
│  │  - approval_status   │   │
│  │  - status            │   │
│  └──────────────────────┘   │
└────────────┬────────────────┘
             │ 5. Success response
             ▼
┌─────────────────────────────┐
│  Student Dashboard          │
│  ┌──────────────────────┐   │
│  │ Refresh → sees       │   │
│  │ updated marks        │   │
│  └──────────────────────┘   │
└─────────────────────────────┘
```

### 3. Student View Flow

```
┌─────────┐
│ Student │
└────┬────┘
     │ 1. Login
     ▼
┌─────────────────────────────┐
│   Dashboard Component       │
│  ┌──────────────────────┐   │
│  │ Render MyGuide       │   │
│  │ component            │   │
│  └──────────┬───────────┘   │
└─────────────┼───────────────┘
              │
              ▼
┌─────────────────────────────┐
│   MyGuide Component         │
│  ┌──────────────────────┐   │
│  │ getGuideForStudent   │   │
│  │ (studentId)          │   │
│  └──────────┬───────────┘   │
│             │                │
│  ┌──────────▼───────────┐   │
│  │ getCoordinatorFor    │   │
│  │ Student(studentId)   │   │
│  └──────────┬───────────┘   │
└─────────────┼───────────────┘
              │ 2. API calls
              ▼
┌─────────────────────────────┐
│      server.js              │
│  ┌──────────────────────┐   │
│  │ GET /api/students/   │   │
│  │ :id/guide            │   │
│  └──────────┬───────────┘   │
│             │                │
│  ┌──────────▼───────────┐   │
│  │ Find project by      │   │
│  │ student_id           │   │
│  └──────────┬───────────┘   │
│             │                │
│  ┌──────────▼───────────┐   │
│  │ Lookup guide by      │   │
│  │ guide_id             │   │
│  └──────────┬───────────┘   │
└─────────────┼───────────────┘
              │ 3. Return guide details
              ▼
┌─────────────────────────────┐
│   MyGuide Component         │
│  ┌──────────────────────┐   │
│  │ Display:             │   │
│  │  - Guide name        │   │
│  │  - Email             │   │
│  │  - Department        │   │
│  │  - Specialization    │   │
│  │  - Coordinator info  │   │
│  └──────────────────────┘   │
└─────────────────────────────┘
```

## 🗄️ Database Schema

### Collections Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      MongoDB Database                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐     ┌────────────────┐                 │
│  │     users      │     │     topics     │                 │
│  ├────────────────┤     ├────────────────┤                 │
│  │ _id            │◄────┤ student_id     │                 │
│  │ email          │     │ title          │                 │
│  │ full_name      │     │ description    │                 │
│  │ role           │     │ specialization │                 │
│  │ department     │  ┌──┤ guide_id       │                 │
│  │ specialization │  │  │ coordinator_id │──┐              │
│  │ ...            │  │  │ marks          │  │              │
│  └────────────────┘  │  │ feedback       │  │              │
│         ▲            │  │ approval_status│  │              │
│         │            │  │ status         │  │              │
│         │            │  └────────────────┘  │              │
│         │            │                      │              │
│  ┌──────┴──────────┐ │  ┌──────────────────▼────┐         │
│  │ guide_          │ │  │ coordinator_          │         │
│  │ assignments     │ │  │ assignments           │         │
│  ├─────────────────┤ │  ├───────────────────────┤         │
│  │ _id             │ │  │ _id                   │         │
│  │ student_id      │ │  │ student_id            │         │
│  │ project_id      │ │  │ project_id            │         │
│  │ guide_id        │─┘  │ coordinator_id        │         │
│  │ assigned_at     │    │ assigned_at           │         │
│  │ assignment_     │    │ status                │         │
│  │   reason        │    └───────────────────────┘         │
│  │ status          │                                       │
│  └─────────────────┘                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Relationships

```
users (role: 'student')
    │
    │ 1:N (student can have multiple projects)
    ▼
topics (projects)
    │
    ├─► guide_id ──────► users (role: 'guide')
    │                        │
    │                        │ 1:N (guide can have multiple students)
    │                        ▼
    │                   guide_assignments
    │
    └─► coordinator_id ─► users (role: 'coordinator')
                             │
                             │ 1:N (coordinator can monitor multiple students)
                             ▼
                        coordinator_assignments
```

## 🔐 Security & Permissions

### Role-Based Access Control

```
┌─────────────────────────────────────────────────────────────┐
│                    Permission Matrix                         │
├─────────────┬─────────┬─────────┬─────────────┬─────────────┤
│   Action    │ Student │  Guide  │ Coordinator │    Admin    │
├─────────────┼─────────┼─────────┼─────────────┼─────────────┤
│ View own    │    ✅   │    ✅   │     ✅      │     ✅      │
│ profile     │         │         │             │             │
├─────────────┼─────────┼─────────┼─────────────┼─────────────┤
│ View guide  │    ✅   │    ❌   │     ❌      │     ✅      │
│ details     │         │         │             │             │
├─────────────┼─────────┼─────────┼─────────────┼─────────────┤
│ View        │    ✅   │    ❌   │     ✅      │     ✅      │
│ coordinator │         │         │             │             │
├─────────────┼─────────┼─────────┼─────────────┼─────────────┤
│ View        │    ❌   │    ✅   │     ✅      │     ✅      │
│ assigned    │         │         │             │             │
│ students    │         │         │             │             │
├─────────────┼─────────┼─────────┼─────────────┼─────────────┤
│ Assign      │    ❌   │    ❌   │     ❌      │     ✅      │
│ guides      │         │         │             │             │
├─────────────┼─────────┼─────────┼─────────────┼─────────────┤
│ Review      │    ❌   │    ✅   │     ❌      │     ✅      │
│ projects    │         │         │             │             │
├─────────────┼─────────┼─────────┼─────────────┼─────────────┤
│ Assign      │    ❌   │    ✅   │     ❌      │     ✅      │
│ marks       │         │         │             │             │
├─────────────┼─────────┼─────────┼─────────────┼─────────────┤
│ Delete      │    ❌   │    ✅   │     ❌      │     ✅      │
│ projects    │         │         │             │             │
├─────────────┼─────────┼─────────┼─────────────┼─────────────┤
│ Monitor     │    ❌   │    ❌   │     ✅      │     ✅      │
│ progress    │         │         │             │             │
└─────────────┴─────────┴─────────┴─────────────┴─────────────┘
```

## 🔄 State Management

### Component State Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    React Component Tree                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                      ┌──────────┐                           │
│                      │   App    │                           │
│                      └────┬─────┘                           │
│                           │                                  │
│              ┌────────────┴────────────┐                    │
│              │                         │                     │
│         ┌────▼────┐              ┌────▼────┐               │
│         │ Header  │              │ Sidebar │               │
│         └─────────┘              └─────────┘               │
│                                                              │
│                      ┌──────────┐                           │
│                      │Dashboard │                           │
│                      └────┬─────┘                           │
│                           │                                  │
│        ┌──────────────────┼──────────────────┐             │
│        │                  │                  │              │
│   ┌────▼────┐      ┌──────▼──────┐   ┌──────▼──────┐      │
│   │ Student │      │    Guide    │   │ Coordinator │      │
│   │  View   │      │  Dashboard  │   │    Panel    │      │
│   └────┬────┘      └──────┬──────┘   └──────┬──────┘      │
│        │                  │                  │              │
│   ┌────▼────┐      ┌──────▼──────┐   ┌──────▼──────┐      │
│   │MyGuide  │      │   Review    │   │   Monitor   │      │
│   │Component│      │    Modal    │   │    View     │      │
│   └─────────┘      └─────────────┘   └─────────────┘      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 📡 API Architecture

### RESTful Endpoints

```
┌─────────────────────────────────────────────────────────────┐
│                      API Structure                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  /api                                                        │
│   │                                                          │
│   ├── /users                                                │
│   │    ├── GET    /                (List all users)        │
│   │    ├── GET    /:id             (Get user by ID)        │
│   │    ├── GET    /email/:email    (Get user by email)     │
│   │    ├── GET    /guides          (List guides)           │
│   │    ├── GET    /students        (List students)         │
│   │    ├── PUT    /:id             (Update user)           │
│   │    └── DELETE /:id             (Delete user)           │
│   │                                                          │
│   ├── /assignments                                          │
│   │    ├── POST   /guide           (Assign guide)          │
│   │    └── POST   /coordinator     (Assign coordinator)    │
│   │                                                          │
│   ├── /guides                                               │
│   │    ├── GET    /:id/students    (Get assigned students) │
│   │    └── GET    /:id/projects    (Get projects)          │
│   │                                                          │
│   ├── /coordinators                                         │
│   │    └── GET    /:id/students    (Get monitored students)│
│   │                                                          │
│   ├── /students                                             │
│   │    ├── GET    /:id/guide       (Get assigned guide)    │
│   │    └── GET    /:id/coordinator (Get coordinator)       │
│   │                                                          │
│   ├── /projects                                             │
│   │    ├── PUT    /:id/review      (Submit review)         │
│   │    └── DELETE /:id             (Delete project)        │
│   │                                                          │
│   └── /student-projects                                     │
│        └── GET    /                (List all projects)      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Deployment Architecture

### Production Setup

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Environment                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   Load Balancer                       │  │
│  │                  (nginx/HAProxy)                      │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                      │
│         ┌─────────────┴─────────────┐                       │
│         │                           │                        │
│  ┌──────▼──────┐            ┌──────▼──────┐               │
│  │   Node.js   │            │   Node.js   │               │
│  │  Instance 1 │            │  Instance 2 │               │
│  │  (server.js)│            │  (server.js)│               │
│  └──────┬──────┘            └──────┬──────┘               │
│         │                           │                        │
│         └─────────────┬─────────────┘                       │
│                       │                                      │
│                ┌──────▼──────┐                              │
│                │   MongoDB   │                              │
│                │   Cluster   │                              │
│                │  (Replica   │                              │
│                │    Set)     │                              │
│                └─────────────┘                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 📈 Performance Considerations

### Optimization Strategies

```
┌─────────────────────────────────────────────────────────────┐
│                  Performance Optimizations                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Database Layer:                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • Indexes on email, guide_id, coordinator_id         │  │
│  │ • Compound indexes for common queries                │  │
│  │ • Connection pooling                                 │  │
│  │ • Query result caching                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  API Layer:                                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • Response compression (gzip)                        │  │
│  │ • Rate limiting per user                             │  │
│  │ • API response caching                               │  │
│  │ • Pagination for large datasets                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Frontend Layer:                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • Code splitting by route                            │  │
│  │ • Lazy loading components                            │  │
│  │ • Memoization of expensive computations             │  │
│  │ • Debounced API calls                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🔍 Monitoring & Logging

### System Observability

```
┌─────────────────────────────────────────────────────────────┐
│                    Monitoring Stack                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Application Logs:                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • API request/response logs                          │  │
│  │ • Error tracking (Sentry/Rollbar)                    │  │
│  │ • User action logs                                   │  │
│  │ • Assignment audit trail                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Performance Metrics:                                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • API response times                                 │  │
│  │ • Database query performance                         │  │
│  │ • Memory usage                                       │  │
│  │ • CPU utilization                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Business Metrics:                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • Guide assignment rate                              │  │
│  │ • Project review completion time                     │  │
│  │ • Average marks per guide                            │  │
│  │ • Student-guide ratio                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

**Document Version:** 1.0  
**Last Updated:** 2025-10-10  
**Maintained By:** Development Team
