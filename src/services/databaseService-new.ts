import { User, Topic } from '../types';
import {
  getUserByEmail as apiGetUserByEmail,
  getUserById as apiGetUserById,
  getAllUsers as apiGetAllUsers,
  getGuides as apiGetGuides,
  getStudents as apiGetStudents,
  getPendingUsers as apiGetPendingUsers,
  getStudentProjects as apiGetStudentProjects,
  getStudentGuideAssignments as apiGetStudentGuideAssignments,
  authenticateUser as apiAuthenticateUser,
  registerPendingUser as apiRegisterPendingUser,
  approvePendingUser as apiApprovePendingUser,
  rejectPendingUser as apiRejectPendingUser,
  allocateGuideToStudent as apiAllocateGuideToStudent,
  getAssignmentsForGuide as apiGetAssignmentsForGuide,
  getAssignmentsForStudent as apiGetAssignmentsForStudent,
  updateUserPassword as apiUpdateUserPassword,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
  initializeDatabase as apiInitializeDatabase
} from './apiDatabaseService';

// Re-export all functions from API database service
export const getUserByEmail = apiGetUserByEmail;
export const getUserById = apiGetUserById;
export const getAllUsers = apiGetAllUsers;
export const getGuides = apiGetGuides;
export const getStudents = apiGetStudents;
export const getPendingUsers = apiGetPendingUsers;
export const getStudentProjects = apiGetStudentProjects;
export const getStudentGuideAssignments = apiGetStudentGuideAssignments;
export const authenticateUser = apiAuthenticateUser;
export const registerPendingUser = apiRegisterPendingUser;
export const approvePendingUser = apiApprovePendingUser;
export const rejectPendingUser = apiRejectPendingUser;
export const allocateGuideToStudent = apiAllocateGuideToStudent;
export const getAssignmentsForGuide = apiGetAssignmentsForGuide;
export const getAssignmentsForStudent = apiGetAssignmentsForStudent;
export const updateUserPassword = apiUpdateUserPassword;
export const updateUser = apiUpdateUser;
export const deleteUser = apiDeleteUser;
export const initializeDatabase = apiInitializeDatabase;

// Re-export types from API database service
export type { User, PendingUser, StudentProject, StudentGuideAssignment, UserWithExpertise } from './apiDatabaseService';
