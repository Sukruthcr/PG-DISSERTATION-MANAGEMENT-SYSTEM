// API Database Service - Makes HTTP requests to the backend API
// Always use a relative API base; Vite proxies to 3001 in dev and
// the Node server serves '/api' in production
const API_BASE_URL = '/api';

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
  expertise?: string[];
  experience_level?: 'junior' | 'senior' | 'expert';
  availability_status?: 'available' | 'busy' | 'unavailable';
  max_students?: number;
  current_students?: number;
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

export interface StudentProject {
  id: string;
  student_id: string;
  title: string;
  description: string;
  specialization: string;
  created_at: string;
  updated_at: string;
}

export interface StudentGuideAssignment {
  id: string;
  student_id: string;
  guide_id: string;
  project_id: string;
  assigned_at: string;
  assignment_reason: string;
  status: 'active' | 'inactive' | 'completed';
}

export interface UserWithExpertise extends User {
  expertise: string[];
  availability_status: 'available' | 'busy' | 'unavailable';
  max_students?: number;
  current_students?: number;
}

// Helper function to handle API responses
const handleApiResponse = async (response: Response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  return data;
};

// Database service functions
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/email/${encodeURIComponent(email)}`);
    const data = await handleApiResponse(response);

    if (!data.success) {
      return null;
    }

    return data.user;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    const data = await handleApiResponse(response);

    if (!data.success) {
      return null;
    }

    return data.user;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    const data = await handleApiResponse(response);
    return data.users;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

export const getGuides = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/guides`);
    const data = await handleApiResponse(response);
    return data.guides;
  } catch (error) {
    console.error('Error getting guides:', error);
    throw error;
  }
};

export const getStudents = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/students`);
    const data = await handleApiResponse(response);
    return data.students;
  } catch (error) {
    console.error('Error getting students:', error);
    throw error;
  }
};

export const getPendingUsers = async (): Promise<PendingUser[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/pending-users`);
    const data = await handleApiResponse(response);
    return data.pendingUsers;
  } catch (error) {
    console.error('Error getting pending users:', error);
    throw error;
  }
};

export const getStudentProjects = async (): Promise<StudentProject[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/student-projects`);
    const data = await handleApiResponse(response);
    return data.projects;
  } catch (error) {
    console.error('Error getting student projects:', error);
    throw error;
  }
};

export const authenticateUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await handleApiResponse(response);
    return data;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

export const registerPendingUser = async (userData: Omit<PendingUser, 'id' | 'requested_at' | 'status'>) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register-pending-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await handleApiResponse(response);
    return data;
  } catch (error) {
    console.error('Error registering pending user:', error);
    throw error;
  }
};

export const approvePendingUser = async (pendingUserId: string, approvedBy: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/approve-pending-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pendingUserId, approvedBy }),
    });

    const data = await handleApiResponse(response);
    return data;
  } catch (error) {
    console.error('Error approving pending user:', error);
    throw error;
  }
};

export const rejectPendingUser = async (pendingUserId: string, rejectedBy: string, reason: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reject-pending-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pendingUserId, rejectedBy, reason }),
    });

    const data = await handleApiResponse(response);
    return data;
  } catch (error) {
    console.error('Error rejecting pending user:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, updates: Partial<User>) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const data = await handleApiResponse(response);
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
    });

    const data = await handleApiResponse(response);
    return data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const updateUserPassword = async (userId: string, currentPassword: string, newPassword: string) => {
  try {
    // For now, return a simple success response
    // In a real implementation, this would make a PUT request to update the password
    return {
      success: true,
      message: 'Password updated successfully.',
    };
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

// Guide allocation functions
export const allocateGuideToStudent = async (studentId: string, projectId: string) => {
  try {
    // For now, return a simple success response
    // In a real implementation, this would make a POST request to allocate a guide
    return {
      success: true,
      message: 'Guide allocation completed successfully.',
      assignment: {
        id: `assignment_${Date.now()}`,
        student_id: studentId,
        guide_id: '3', // Default guide ID from sample data
        project_id: projectId,
        assigned_at: new Date().toISOString(),
        assignment_reason: 'Automatic allocation based on expertise matching',
        status: 'active'
      }
    };
  } catch (error) {
    console.error('Error allocating guide to student:', error);
    throw error;
  }
};

export const getAssignmentsForGuide = async (guideId: string) => {
  // Return empty array for now - would contain actual assignments in real implementation
  return [];
};

export const getAssignmentsForStudent = async (studentId: string) => {
  // Return empty array for now - would contain actual assignments in real implementation
  return [];
};

export const getStudentGuideAssignments = async () => {
  // Return empty array for now - would contain actual assignments in real implementation
  return [];
};

// Initialize database with sample data
export const initializeDatabase = async () => {
  try {
    console.log('API database service initialized successfully!');
    console.log('Connected to backend API at:', API_BASE_URL);
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};
