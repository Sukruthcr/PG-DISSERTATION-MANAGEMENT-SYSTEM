import { User, Topic } from '../types';
import {
  getUserByEmail as simpleGetUserByEmail,
  getUserById as simpleGetUserById,
  getAllUsers as simpleGetAllUsers,
  getGuides as simpleGetGuides,
  getStudents as simpleGetStudents,
  getPendingUsers as simpleGetPendingUsers,
  authenticateUser as simpleAuthenticateUser,
  registerPendingUser as simpleRegisterPendingUser,
  approvePendingUser as simpleApprovePendingUser,
  rejectPendingUser as simpleRejectPendingUser,
  updateUser as simpleUpdateUser,
  deleteUser as simpleDeleteUser,
  initializeDatabase as simpleInitializeDatabase,
  PendingUser
} from './simpleDatabaseService';

// Re-export all functions from simple database service
export const getUserByEmail = simpleGetUserByEmail;
export const getUserById = simpleGetUserById;
export const getAllUsers = simpleGetAllUsers;
export const getGuides = simpleGetGuides;
export const getStudents = simpleGetStudents;
export const getPendingUsers = simpleGetPendingUsers;
export const authenticateUser = simpleAuthenticateUser;
export const registerPendingUser = simpleRegisterPendingUser;
export const approvePendingUser = simpleApprovePendingUser;
export const rejectPendingUser = simpleRejectPendingUser;
export const updateUser = simpleUpdateUser;
export const deleteUser = simpleDeleteUser;
export const initializeDatabase = simpleInitializeDatabase;

// Re-export types
export type { PendingUser };

// Enhanced users table with expertise (for backward compatibility)
export interface UserWithExpertise extends User {
  expertise: string[];
  max_students?: number;
  current_students?: number;
  experience_level: 'junior' | 'senior' | 'expert';
  availability_status: 'available' | 'busy' | 'unavailable';
}

// Additional functions for enhanced features
export const getStudentProjects = async (): Promise<Topic[]> => {
  // Return empty array for now - can be implemented later
  return [];
};

export const getStudentGuideAssignments = async (): Promise<any[]> => {
  // Return empty array for now - can be implemented later
  return [];
};

export const allocateGuideToStudent = async (studentId: string, projectId: string) => {
  // Return not implemented for now - can be implemented later
  return {
    success: false,
    message: 'Guide allocation not implemented in simple database service.'
  };
};

export const getAssignmentsForGuide = (guideId: string): any[] => {
  // Return empty array for now - can be implemented later
  return [];
};

export const getAssignmentsForStudent = (studentId: string): any[] => {
  // Return empty array for now - can be implemented later
  return [];
};

export const updateUserPassword = async (userId: string, currentPassword: string, newPassword: string) => {
  // Return not implemented for now - can be implemented later
  return {
    success: false,
    message: 'Password update not implemented in simple database service.'
  };
};
