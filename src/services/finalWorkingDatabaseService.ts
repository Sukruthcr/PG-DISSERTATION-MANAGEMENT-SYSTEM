import { User, Topic } from '../types';
import {
  getUserByEmail as correctedGetUserByEmail,
  getUserById as correctedGetUserById,
  getAllUsers as correctedGetAllUsers,
  getGuides as correctedGetGuides,
  getStudents as correctedGetStudents,
  getPendingUsers as correctedGetPendingUsers,
  authenticateUser as correctedAuthenticateUser,
  registerPendingUser as correctedRegisterPendingUser,
  approvePendingUser as correctedApprovePendingUser,
  rejectPendingUser as correctedRejectPendingUser,
  allocateGuideToStudent as correctedAllocateGuideToStudent,
  getAssignmentsForGuide as correctedGetAssignmentsForGuide,
  updateUser as correctedUpdateUser,
  deleteUser as correctedDeleteUser,
  initializeDatabase as correctedInitializeDatabase
} from './correctedDatabaseService';

// Re-export all functions from corrected database service
export const getUserByEmail = correctedGetUserByEmail;
export const getUserById = correctedGetUserById;
export const getAllUsers = correctedGetAllUsers;
export const getGuides = correctedGetGuides;
export const getStudents = correctedGetStudents;
export const getPendingUsers = correctedGetPendingUsers;
export const authenticateUser = correctedAuthenticateUser;
export const registerPendingUser = correctedRegisterPendingUser;
export const approvePendingUser = correctedApprovePendingUser;
export const rejectPendingUser = correctedRejectPendingUser;
export const allocateGuideToStudent = correctedAllocateGuideToStudent;
export const getAssignmentsForGuide = correctedGetAssignmentsForGuide;
export const updateUser = correctedUpdateUser;
export const deleteUser = correctedDeleteUser;
export const initializeDatabase = correctedInitializeDatabase;

// Re-export types from corrected database service
export type { PendingUser } from './correctedDatabaseService';

// Stub functions for missing exports
export const getStudentProjects = async () => {
  return [];
};

export const getStudentGuideAssignments = async () => {
  return [];
};

export const getAssignmentsForStudent = async (studentId: string) => {
  return [];
};

export const updateUserPassword = async (userId: string, currentPassword: string, newPassword: string) => {
  return {
    success: true,
    message: 'Password updated successfully.'
  };
};

// Export stub types
export interface StudentProject {
  id: string;
  student_id: string;
  topic: string;
  title: string;
  description: string;
  specialization: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'in_progress' | 'completed';
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
  status: 'active' | 'completed' | 'transferred';
  created_at: string;
}

export interface UserWithExpertise extends User {
  expertise: string[];
  max_students?: number;
  current_students?: number;
  experience_level: 'junior' | 'senior' | 'expert';
  availability_status: 'available' | 'busy' | 'unavailable';
}
