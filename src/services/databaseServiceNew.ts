import { User, Topic } from '../types';

// Import the simple database service
import {
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
  initializeDatabase as initSimpleDb
} from './simpleDatabaseService';

// Convert simple user to User interface
const mapSimpleUserToUser = (user: any): User => ({
  id: user.id || '',
  email: user.email,
  full_name: user.full_name,
  role: user.role,
  department: user.department,
  specialization: user.specialization,
  phone: user.phone,
  employee_id: user.employee_id,
  student_id: user.student_id,
  created_at: user.created_at || new Date().toISOString(),
  updated_at: user.updated_at || new Date().toISOString(),
});

// Enhanced users table with expertise
export interface UserWithExpertise extends User {
  expertise: string[];
  max_students?: number;
  current_students?: number;
  experience_level: 'junior' | 'senior' | 'expert';
  availability_status: 'available' | 'busy' | 'unavailable';
}

// Database service functions using simple in-memory database
export const getUserByEmailDb = async (email: string): Promise<User | null> => {
  const user = await getUserByEmail(email);
  return user ? mapSimpleUserToUser(user) : null;
};

export const getUserByIdDb = async (id: string): Promise<User | null> => {
  const user = await getUserById(id);
  return user ? mapSimpleUserToUser(user) : null;
};

export const getAllUsersDb = async (): Promise<User[]> => {
  const users = await getAllUsers();
  return users.map(mapSimpleUserToUser);
};

export const getGuidesDb = async (): Promise<User[]> => {
  const guides = await getGuides();
  return guides.map(mapSimpleUserToUser);
};

export const getStudentsDb = async (): Promise<User[]> => {
  const students = await getStudents();
  return students.map(mapSimpleUserToUser);
};

export const getPendingUsersDb = async (): Promise<any[]> => {
  return await getPendingUsers();
};

export const getStudentProjects = async (): Promise<Topic[]> => {
  // Return empty array for now - can be implemented later
  return [];
};

export const authenticateUserDb = async (email: string, password: string) => {
  return await authenticateUser(email, password);
};

export const registerPendingUserDb = async (userData: any) => {
  return await registerPendingUser(userData);
};

export const approvePendingUserDb = async (pendingUserId: string, approvedBy: string) => {
  return await approvePendingUser(pendingUserId, approvedBy);
};

export const rejectPendingUserDb = async (pendingUserId: string, rejectedBy: string, reason: string) => {
  return await rejectPendingUser(pendingUserId, rejectedBy, reason);
};

export const updateUserDb = async (userId: string, updates: Partial<User>) => {
  return await updateUser(userId, updates);
};

export const deleteUserDb = async (userId: string) => {
  return await deleteUser(userId);
};

// Initialize database with sample data
export const initializeDatabase = async () => {
  await initSimpleDb();
  console.log('Database service initialized successfully!');
};
