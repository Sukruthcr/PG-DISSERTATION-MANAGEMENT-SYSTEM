import { mongoDb, UserDocument, TopicDocument, PendingUserDocument } from './mongoService';
import { ObjectId } from 'mongodb';

// Types for the service
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

// Helper function to convert MongoDB document to User
const documentToUser = (doc: UserDocument): User => ({
  id: doc._id.toString(),
  email: doc.email,
  full_name: doc.full_name,
  role: doc.role,
  department: doc.department,
  specialization: doc.specialization,
  phone: doc.phone,
  student_id: doc.student_id,
  employee_id: doc.employee_id,
  expertise: doc.expertise || [],
  experience_level: doc.experience_level || 'junior',
  availability_status: doc.availability_status || 'available',
  max_students: doc.max_students,
  current_students: doc.current_students || 0,
  created_at: doc.created_at.toISOString(),
  updated_at: doc.updated_at.toISOString(),
});

// Helper function to convert MongoDB document to PendingUser
const documentToPendingUser = (doc: PendingUserDocument): PendingUser => ({
  id: doc._id.toString(),
  email: doc.email,
  full_name: doc.full_name,
  department: doc.department,
  specialization: doc.specialization,
  phone: doc.phone,
  student_id: doc.student_id,
  employee_id: doc.employee_id,
  requested_role: doc.requested_role,
  status: doc.status,
  requested_at: doc.requested_at.toISOString(),
  reviewed_at: doc.reviewed_at?.toISOString(),
  reviewed_by: doc.reviewed_by,
  rejection_reason: doc.rejection_reason,
});

// Database service functions
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    await mongoDb.connect();
    const usersCollection = mongoDb.getCollection('users');
    const userDoc = await usersCollection.findOne({ email: email.toLowerCase() });

    if (!userDoc) return null;

    return documentToUser(userDoc as UserDocument);
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    await mongoDb.connect();
    const usersCollection = mongoDb.getCollection('users');
    const userDoc = await usersCollection.findOne({ _id: new ObjectId(id) });

    if (!userDoc) return null;

    return documentToUser(userDoc as UserDocument);
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    await mongoDb.connect();
    const usersCollection = mongoDb.getCollection('users');
    const userDocs = await usersCollection.find({}).toArray();

    return userDocs.map(doc => documentToUser(doc as UserDocument));
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

export const getGuides = async (): Promise<User[]> => {
  try {
    await mongoDb.connect();
    const usersCollection = mongoDb.getCollection('users');
    const userDocs = await usersCollection.find({ role: 'guide' }).toArray();

    return userDocs.map(doc => documentToUser(doc as UserDocument));
  } catch (error) {
    console.error('Error getting guides:', error);
    throw error;
  }
};

export const getStudents = async (): Promise<User[]> => {
  try {
    await mongoDb.connect();
    const usersCollection = mongoDb.getCollection('users');
    const userDocs = await usersCollection.find({ role: 'student' }).toArray();

    return userDocs.map(doc => documentToUser(doc as UserDocument));
  } catch (error) {
    console.error('Error getting students:', error);
    throw error;
  }
};

export const getPendingUsers = async (): Promise<PendingUser[]> => {
  try {
    await mongoDb.connect();
    const pendingUsersCollection = mongoDb.getCollection('pending_users');
    const pendingUserDocs = await pendingUsersCollection.find({}).toArray();

    return pendingUserDocs.map(doc => documentToPendingUser(doc as PendingUserDocument));
  } catch (error) {
    console.error('Error getting pending users:', error);
    throw error;
  }
};

export const getStudentProjects = async (): Promise<any[]> => {
  try {
    await mongoDb.connect();
    const topicsCollection = mongoDb.getCollection('topics');
    const projectDocs = await topicsCollection.find({}).toArray();

    return projectDocs.map(doc => ({
      id: doc._id.toString(),
      student_id: doc.student_id,
      title: doc.title,
      description: doc.description,
      specialization: doc.specialization || '',
      created_at: doc.created_at.toISOString(),
      updated_at: doc.updated_at.toISOString(),
    }));
  } catch (error) {
    console.error('Error getting student projects:', error);
    throw error;
  }
};

export const authenticateUser = async (email: string, password: string) => {
  // This function should not be used directly.
  // The frontend should call the API service which hits the /api/authenticate endpoint.
  // This is a fallback to prevent crashes if it's still called.
  console.warn('Direct database authentication is deprecated. Use apiDatabaseService.');
  return {
    success: false,
    message: 'Direct DB authentication is deprecated. Please use the API.',
    return {
      success: true,
      user: {
        ...user,
        updated_at: new Date().toISOString(),
      }
    };
};

export const registerPendingUser = async (userData: Omit<PendingUser, 'id' | 'requested_at' | 'status'>) => {
  try {
    await mongoDb.connect();

    // Check if user already exists
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
      return {
        success: false,
        message: 'User with this email already exists.'
      };
    }

    // Check if already pending
    const pendingUsersCollection = mongoDb.getCollection('pending_users');
    const existingPending = await pendingUsersCollection.findOne({ email: userData.email.toLowerCase() });
    if (existingPending) {
      return {
        success: false,
        message: 'Registration request already pending approval.'
      };
    }

    const newPendingUser: Omit<PendingUserDocument, '_id'> = {
      ...userData,
      email: userData.email.toLowerCase(),
      requested_at: new Date(),
      status: 'pending',
    };

    const result = await pendingUsersCollection.insertOne(newPendingUser);

    return {
      success: true,
      message: 'Registration request submitted successfully. Please wait for admin approval.',
      pendingUser: {
        ...newPendingUser,
        id: result.insertedId.toString(),
        requested_at: newPendingUser.requested_at.toISOString(),
      }
    };
  } catch (error) {
    console.error('Error registering pending user:', error);
    throw error;
  }
};

export const approvePendingUser = async (pendingUserId: string, approvedBy: string) => {
  try {
    await mongoDb.connect();

    const pendingUsersCollection = mongoDb.getCollection('pending_users');
    const usersCollection = mongoDb.getCollection('users');

    const pendingUserDoc = await pendingUsersCollection.findOne({ _id: new ObjectId(pendingUserId) });
    if (!pendingUserDoc) {
      return {
        success: false,
        message: 'Pending user not found'
      };
    }

    // Create new user
    const newUser: Omit<UserDocument, '_id'> = {
      email: pendingUserDoc.email,
      full_name: pendingUserDoc.full_name,
      role: pendingUserDoc.requested_role,
      department: pendingUserDoc.department,
      specialization: pendingUserDoc.specialization,
      phone: pendingUserDoc.phone,
      student_id: pendingUserDoc.student_id,
      employee_id: pendingUserDoc.employee_id,
      expertise: [],
      experience_level: 'junior',
      availability_status: 'available',
      max_students: pendingUserDoc.requested_role === 'guide' ? 8 : undefined,
      current_students: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const userResult = await usersCollection.insertOne(newUser);

    // Update pending user status
    await pendingUsersCollection.updateOne(
      { _id: new ObjectId(pendingUserId) },
      {
        $set: {
          status: 'approved',
          reviewed_at: new Date(),
          reviewed_by: approvedBy,
        }
      }
    );

    return {
      success: true,
      message: 'User approved successfully',
      user: {
        ...newUser,
        id: userResult.insertedId.toString(),
        created_at: newUser.created_at.toISOString(),
        updated_at: newUser.updated_at.toISOString(),
      }
    };
  } catch (error) {
    console.error('Error approving pending user:', error);
    throw error;
  }
};

export const rejectPendingUser = async (pendingUserId: string, rejectedBy: string, reason: string) => {
  try {
    await mongoDb.connect();

    const pendingUsersCollection = mongoDb.getCollection('pending_users');

    const result = await pendingUsersCollection.updateOne(
      { _id: new ObjectId(pendingUserId) },
      {
        $set: {
          status: 'rejected',
          reviewed_at: new Date(),
          reviewed_by: rejectedBy,
          rejection_reason: reason,
        }
      }
    );

    if (result.matchedCount === 0) {
      return {
        success: false,
        message: 'Pending user not found'
      };
    }

    return {
      success: true,
      message: 'User registration rejected successfully'
    };
  } catch (error) {
    console.error('Error rejecting pending user:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, updates: Partial<User>) => {
  try {
    await mongoDb.connect();

    const usersCollection = mongoDb.getCollection('users');

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          ...updates,
          updated_at: new Date().toISOString(),
        }
      }
    );

    if (result.matchedCount === 0) {
      throw new Error('User not found');
    }

    // Return updated user list
    const updatedUsers = await getAllUsers();
    return updatedUsers;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    await mongoDb.connect();

    const usersCollection = mongoDb.getCollection('users');
    const user = await getUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    await usersCollection.deleteOne({ _id: new ObjectId(userId) });

    // Return updated user list
    const updatedUsers = await getAllUsers();
    return updatedUsers;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const updateUserPassword = async (userId: string, currentPassword: string, newPassword: string) => {
  try {
    const user = await getUserById(userId);
    if (!user) {
      return { success: false, message: 'User not found.' };
    }

    // This should be handled by a dedicated API endpoint that can securely
    // verify the current password and update it.
    console.warn('updateUserPassword in mongoDatabaseService is a mock. Implement in API.');
    if (currentPassword !== 'password123') { // Mock check
        return { success: false, message: 'Current password is incorrect.' };
    }

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
    await mongoDb.connect();

    // For now, return a simple success response
    // In a real implementation, this would:
    // 1. Find the student and project
    // 2. Match with an appropriate guide based on expertise
    // 3. Create an assignment record
    // 4. Update the project with the assigned guide

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
    await mongoDb.connect();
    console.log('MongoDB database service initialized successfully!');

    // Check if sample data already exists
    const usersCollection = mongoDb.getCollection('users');
    const userCount = await usersCollection.countDocuments();

    if (userCount === 0) {
      console.log('No users found. Sample data will be added by the initialization script.');
    } else {
      console.log(`${userCount} users found in database.`);
    }

    console.log('MongoDB connection established successfully!');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};
