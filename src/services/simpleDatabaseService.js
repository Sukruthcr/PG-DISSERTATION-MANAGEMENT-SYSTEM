// Simple in-memory database service for testing registration system
// JavaScript version for testing

// In-memory data storage
const usersTable = [
  {
    id: '1',
    email: 'admin@university.edu',
    full_name: 'System Administrator',
    role: 'admin',
    department: 'IT Administration',
    specialization: 'System Management',
    phone: '+1-555-0001',
    employee_id: 'ADM001',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'coordinator@university.edu',
    full_name: 'Dr. Sarah Johnson',
    role: 'coordinator',
    department: 'Computer Science',
    specialization: 'Academic Coordination',
    phone: '+1-555-0002',
    employee_id: 'COO001',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    email: 'guide@university.edu',
    full_name: 'Dr. Michael Chen',
    role: 'guide',
    department: 'Computer Science',
    specialization: 'Machine Learning',
    phone: '+1-555-0003',
    employee_id: 'GDE001',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    email: 'student@university.edu',
    full_name: 'John Doe',
    role: 'student',
    department: 'Computer Science',
    specialization: 'Data Science',
    phone: '+1-555-0004',
    student_id: 'CS2024001',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    email: 'ethics@university.edu',
    full_name: 'Dr. Emily Rodriguez',
    role: 'ethics_committee',
    department: 'Research Ethics',
    specialization: 'Ethics Review',
    phone: '+1-555-0005',
    employee_id: 'ETH001',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

const pendingUsersTable = [];

// Password database (in real app, this would be hashed)
const passwordDatabase = {
  'admin@university.edu': 'admin123',
  'coordinator@university.edu': 'coordinator123',
  'guide@university.edu': 'guide123',
  'student@university.edu': 'student123',
  'ethics@university.edu': 'ethics123',
};

// Database service functions
const getUserByEmail = async (email) => {
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API delay
  return usersTable.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
};

const getUserById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return usersTable.find(user => user.id === id) || null;
};

const getAllUsers = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...usersTable];
};

const getGuides = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return usersTable.filter(user => user.role === 'guide');
};

const getStudents = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return usersTable.filter(user => user.role === 'student');
};

const getPendingUsers = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...pendingUsersTable];
};

const authenticateUser = async (email, password) => {
  await new Promise(resolve => setTimeout(resolve, 500));

  console.log('Authenticating user:', email);
  const user = await getUserByEmail(email);
  console.log('User found:', user);

  if (!user) {
    console.log('User not found');
    return {
      success: false,
      message: 'User not found. Please register for an account.',
      requiresRegistration: true
    };
  }

  const storedPassword = passwordDatabase[email.toLowerCase()];
  console.log('Stored password exists:', !!storedPassword);

  if (!storedPassword || password !== storedPassword) {
    console.log('Password verification failed');
    return {
      success: false,
      message: 'Invalid password. Please try again.'
    };
  }

  console.log('Authentication successful');
  return {
    success: true,
    user: {
      ...user,
      updated_at: new Date().toISOString(),
    }
  };
};

const registerPendingUser = async (userData) => {
  await new Promise(resolve => setTimeout(resolve, 500));

  // Check if user already exists
  const existingUser = await getUserByEmail(userData.email);
  if (existingUser) {
    return {
      success: false,
      message: 'User with this email already exists.'
    };
  }

  // Check if already pending
  const existingPending = pendingUsersTable.find(p => p.email.toLowerCase() === userData.email.toLowerCase());
  if (existingPending) {
    return {
      success: false,
      message: 'Registration request already pending approval.'
    };
  }

  const newPendingUser = {
    ...userData,
    id: `pending_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    requested_at: new Date().toISOString(),
    status: 'pending',
  };

  pendingUsersTable.push(newPendingUser);

  return {
    success: true,
    message: 'Registration request submitted successfully. Please wait for admin approval.',
    pendingUser: newPendingUser
  };
};

const approvePendingUser = async (pendingUserId, approvedBy) => {
  const pendingUserIndex = pendingUsersTable.findIndex(p => p.id === pendingUserId);
  if (pendingUserIndex === -1) {
    return {
      success: false,
      message: 'Pending user not found.'
    };
  }

  const pendingUser = pendingUsersTable[pendingUserIndex];

  // Create new user
  const newUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email: pendingUser.email,
    full_name: pendingUser.full_name,
    role: pendingUser.requested_role,
    department: pendingUser.department,
    specialization: pendingUser.specialization,
    phone: pendingUser.phone,
    student_id: pendingUser.student_id,
    employee_id: pendingUser.employee_id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  usersTable.push(newUser);
  passwordDatabase[newUser.email.toLowerCase()] = 'default123'; // Default password

  // Update pending user status
  pendingUsersTable[pendingUserIndex] = {
    ...pendingUser,
    status: 'approved',
    reviewed_at: new Date().toISOString(),
    reviewed_by: approvedBy,
  };

  return {
    success: true,
    message: 'User approved and added to the system.',
    user: newUser
  };
};

const rejectPendingUser = async (pendingUserId, rejectedBy, reason) => {
  const pendingUserIndex = pendingUsersTable.findIndex(p => p.id === pendingUserId);
  if (pendingUserIndex === -1) {
    return {
      success: false,
      message: 'Pending user not found.'
    };
  }

  pendingUsersTable[pendingUserIndex] = {
    ...pendingUsersTable[pendingUserIndex],
    status: 'rejected',
    reviewed_at: new Date().toISOString(),
    reviewed_by: rejectedBy,
    rejection_reason: reason,
  };

  return {
    success: true,
    message: 'User registration rejected.'
  };
};

const updateUser = async (userId, updates) => {
  const userIndex = usersTable.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return {
      success: false,
      message: 'User not found.'
    };
  }

  usersTable[userIndex] = {
    ...usersTable[userIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  return {
    success: true,
    user: usersTable[userIndex],
    message: 'User updated successfully.'
  };
};

const deleteUser = async (userId) => {
  const userIndex = usersTable.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return {
      success: false,
      message: 'User not found.'
    };
  }

  const user = usersTable[userIndex];
  usersTable.splice(userIndex, 1);
  delete passwordDatabase[user.email.toLowerCase()];

  return {
    success: true,
    message: 'User deleted successfully.'
  };
};

// Initialize database with sample data
const initializeDatabase = async () => {
  console.log('Simple database initialized successfully!');
  console.log('Sample users available:');
  console.log('- admin@university.edu (password: admin123)');
  console.log('- coordinator@university.edu (password: coordinator123)');
  console.log('- guide@university.edu (password: guide123)');
  console.log('- student@university.edu (password: student123)');
  console.log('- ethics@university.edu (password: ethics123)');
};

// Export functions
export {
  getUserByEmail,
  getUserById,
  getAllUsers,
  getGuides,
  getStudents,
  getPendingUsers,
  authenticateUser,
  registerPendingUser,
  approvePendingUser,
  rejectPendingUser,
  updateUser,
  deleteUser,
  initializeDatabase
};
