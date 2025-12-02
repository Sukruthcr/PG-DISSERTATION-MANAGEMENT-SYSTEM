// Simple in-memory database service for testing registration system
// This replaces the MongoDB service for easier testing

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'guide' | 'coordinator' | 'admin' | 'ethics_committee';
  department: string;
  specialization: string;
  phone: string;
  student_id?: string;
  employee_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PendingUser {
  id: string;
  email: string;
  full_name: string;
  department: string;
  specialization: string;
  phone: string;
  student_id?: string;
  employee_id?: string;
  requested_role: 'student' | 'guide' | 'coordinator' | 'admin' | 'ethics_committee';
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
}

// In-memory data storage
const usersTable: User[] = [
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

const pendingUsersTable: PendingUser[] = [];

// Password database (in real app, this would be hashed)
const passwordDatabase: Record<string, string> = {
  'admin@university.edu': 'admin123',
  'coordinator@university.edu': 'coordinator123',
  'guide@university.edu': 'guide123',
  'student@university.edu': 'student123',
  'ethics@university.edu': 'ethics123',
};

// Database service functions
export const getUserByEmail = async (email: string): Promise<User | null> => {
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API delay
  return usersTable.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
};

export const getUserById = async (id: string): Promise<User | null> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return usersTable.find(user => user.id === id) || null;
};

export const getAllUsers = async (): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...usersTable];
};

export const getGuides = async (): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return usersTable.filter(user => user.role === 'guide');
};

export const getStudents = async (): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return usersTable.filter(user => user.role === 'student');
};

export const getPendingUsers = async (): Promise<PendingUser[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...pendingUsersTable];
};

export const authenticateUser = async (email: string, password: string) => {
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

export const registerPendingUser = async (userData: Omit<PendingUser, 'id' | 'requested_at' | 'status'>) => {
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

  const newPendingUser: PendingUser = {
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

export const approvePendingUser = async (pendingUserId: string, approvedBy: string) => {
  const pendingUserIndex = pendingUsersTable.findIndex(p => p.id === pendingUserId);
  if (pendingUserIndex === -1) {
    return {
      success: false,
      message: 'Pending user not found.'
    };
  }

  const pendingUser = pendingUsersTable[pendingUserIndex];

  // Create new user
  const newUser: User = {
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

export const rejectPendingUser = async (pendingUserId: string, rejectedBy: string, reason: string) => {
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

export const updateUser = async (userId: string, updates: Partial<User>) => {
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

export const deleteUser = async (userId: string) => {
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
export const initializeDatabase = async () => {
  console.log('Simple database initialized successfully!');
  console.log('Sample users available:');
  console.log('- admin@university.edu (password: admin123)');
  console.log('- coordinator@university.edu (password: coordinator123)');
  console.log('- guide@university.edu (password: guide123)');
  console.log('- student@university.edu (password: student123)');
  console.log('- ethics@university.edu (password: ethics123)');
};
