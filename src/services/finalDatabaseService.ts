import { User, Topic } from '../types';
import {
  getUserByEmail as correctedGetUserByEmail,
  getUserById as correctedGetUserById,
  getAllUsers as correctedGetAllUsers,
  getGuides as correctedGetGuides,
  getStudents as correctedGetStudents,
  getPendingUsers as correctedGetPendingUsers,
  getStudentProjects as correctedGetStudentProjects,
  getStudentGuideAssignments as correctedGetStudentGuideAssignments,
  authenticateUser as correctedAuthenticateUser,
  registerPendingUser as correctedRegisterPendingUser,
  approvePendingUser as correctedApprovePendingUser,
  rejectPendingUser as correctedRejectPendingUser,
  allocateGuideToStudent as correctedAllocateGuideToStudent,
  getAssignmentsForGuide as correctedGetAssignmentsForGuide,
  getAssignmentsForStudent as correctedGetAssignmentsForStudent,
  updateUserPassword as correctedUpdateUserPassword,
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
export const getStudentProjects = correctedGetStudentProjects;
export const getStudentGuideAssignments = correctedGetStudentGuideAssignments;
export const authenticateUser = correctedAuthenticateUser;
export const registerPendingUser = correctedRegisterPendingUser;
export const approvePendingUser = correctedApprovePendingUser;
export const rejectPendingUser = correctedRejectPendingUser;
export const allocateGuideToStudent = correctedAllocateGuideToStudent;
export const getAssignmentsForGuide = correctedGetAssignmentsForGuide;
export const getAssignmentsForStudent = correctedGetAssignmentsForStudent;
export const updateUserPassword = correctedUpdateUserPassword;
export const updateUser = correctedUpdateUser;
export const deleteUser = correctedDeleteUser;
export const initializeDatabase = correctedInitializeDatabase;

// Re-export types from corrected database service
export type { PendingUser, StudentProject, StudentGuideAssignment, UserWithExpertise } from './correctedDatabaseService';
