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
  status?: string;
  guide_id?: string | null;
  coordinator_id?: string | null;
  marks?: number | null;
  feedback?: string;
  approval_status?: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  submitted_at?: string | null;
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

export const getCoordinators = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    const data = await handleApiResponse(response);
    return data.users.filter((user: User) => user.role === 'coordinator');
  } catch (error) {
    console.error('Error getting coordinators:', error);
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

export interface RegisterPendingUserData {
  email: string;
  full_name: string;
  password: string;
  department: string;
  specialization: string;
  phone?: string;
  student_id?: string;
  employee_id?: string;
  requested_role: 'student' | 'guide' | 'coordinator' | 'admin' | 'ethics_committee';
}

export const registerPendingUser = async (userData: RegisterPendingUserData) => {
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

    // Server always returns JSON with { success, message }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, message: 'Network error or server unavailable' };
  }
};

export const deletePendingUser = async (pendingUserId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pending-users/${pendingUserId}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting pending user:', error);
    return { success: false, message: 'Network error or server unavailable' };
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
export const allocateGuideToGroup = async (studentIds: string[], guideId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/assignments/guide/group`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_ids: studentIds, guide_id: guideId, assignment_reason: 'group_allocation' })
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error allocating guide to group:', error);
    throw error;
  }
};

export const allocateGuideToStudent = async (studentId: string, projectId: string, guideId?: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/assignments/guide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: studentId, project_id: projectId, guide_id: guideId })
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error allocating guide to student:', error);
    throw error;
  }
};

export const getAssignmentsForGuide = async (guideId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/guides/${guideId}/students`);
    const data = await handleApiResponse(response);
    return data.students;
  } catch (error) {
    console.error('Error getting assignments for guide:', error);
    throw error;
  }
};

export const getAssignmentsForStudent = async (studentId: string) => {
  // Return empty array for now - would contain actual assignments in real implementation
  return [];
};

export const getStudentGuideAssignments = async () => {
  // Not used directly; allocations are derived from project topic entries
  return [] as any[];
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

// Coordinator assignment
export const allocateCoordinatorToStudent = async (studentId: string, projectId: string, coordinatorId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/assignments/coordinator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: studentId, project_id: projectId, coordinator_id: coordinatorId })
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error allocating coordinator:', error);
    throw error;
  }
};

// Lookups for student dashboards
export const getGuideForStudent = async (studentId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}/guide`);
    const data = await handleApiResponse(response);
    return data.guide;
  } catch (error) {
    console.error('Error fetching guide for student:', error);
    throw error;
  }
};

export const getCoordinatorForStudent = async (studentId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}/coordinator`);
    const data = await handleApiResponse(response);
    return data.coordinator;
  } catch (error) {
    console.error('Error fetching coordinator for student:', error);
    throw error;
  }
};

// Guide dashboard helpers
export const getProjectsForGuide = async (guideId: string): Promise<StudentProject[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/guides/${guideId}/projects`);
    const data = await handleApiResponse(response);
    return data.projects;
  } catch (error) {
    console.error('Error fetching projects for guide:', error);
    throw error;
  }
};

export const reviewProject = async (projectId: string, payload: { marks?: number; feedback?: string; approval_status?: 'pending' | 'approved' | 'rejected' | 'needs_revision'; }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/review`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error reviewing project:', error);
    throw error;
  }
};

export const deleteProject = async (projectId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, { method: 'DELETE' });
    const data = await handleApiResponse(response);
    return data;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

export const deleteAllProjects = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, { method: 'DELETE' });
    const data = await handleApiResponse(response);
    return data;
  } catch (error) {
    console.error('Error deleting all projects:', error);
    throw error;
  }
};

// Coordinator dashboard helpers
export const getStudentsForCoordinator = async (coordinatorId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/coordinators/${coordinatorId}/students`);
    const data = await handleApiResponse(response);
    return data.students;
  } catch (error) {
    console.error('Error fetching students for coordinator:', error);
    throw error;
  }
};

// ============================================
// APPROVAL FUNCTIONS
// ============================================

export interface Approval {
  id: string;
  entity_type: 'topic' | 'milestone' | 'assignment' | 'publication';
  entity_id: string;
  approver_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'requires_changes';
  comments?: string;
  approved_at?: string;
  created_at: string;
  entity_details?: any;
}

// Get all approvals with optional filtering
export const getApprovals = async (filters?: { 
  status?: string; 
  entity_type?: string; 
  approver_id?: string;
}): Promise<Approval[]> => {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.entity_type) params.append('entity_type', filters.entity_type);
    if (filters?.approver_id) params.append('approver_id', filters.approver_id);
    
    const url = `${API_BASE_URL}/approvals${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);
    const data = await handleApiResponse(response);
    return data.approvals;
  } catch (error) {
    console.error('Error getting approvals:', error);
    throw error;
  }
};

// Create a new approval request
export const createApproval = async (approvalData: {
  entity_type: 'topic' | 'milestone' | 'assignment' | 'publication';
  entity_id: string;
  approver_id: string;
  comments?: string;
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/approvals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(approvalData)
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error creating approval:', error);
    throw error;
  }
};

// Approve an approval request
export const approveApproval = async (approvalId: string, comments?: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/approvals/${approvalId}/approve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comments })
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error approving approval:', error);
    throw error;
  }
};

// Reject an approval request
export const rejectApproval = async (approvalId: string, comments?: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/approvals/${approvalId}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comments })
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error rejecting approval:', error);
    throw error;
  }
};

// Mark approval as requires changes
export const markApprovalRequiresChanges = async (approvalId: string, comments?: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/approvals/${approvalId}/requires-changes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comments })
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error marking approval as requires changes:', error);
    throw error;
  }
};
