import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import path from 'path';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const saltRounds = 10; // Cost factor for hashing

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'pg_dissertation_db';
let db;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    const client = new MongoClient(mongoUrl);
    await client.connect();
    db = client.db(dbName);
    console.log('✅ Connected to MongoDB successfully');

    // Create collections if they don't exist
    const existingCollections = await db.listCollections().toArray();
    const existingNames = new Set(existingCollections.map(c => c.name));
    const collections = ['users', 'pending_users', 'topics', 'guide_assignments', 'coordinator_assignments', 'milestones', 'approvals'];
    for (const collectionName of collections) {
      if (!existingNames.has(collectionName)) {
        await db.createCollection(collectionName);
      }
    }

    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('pending_users').createIndex({ email: 1 }, { unique: true });

    console.log('✅ Database collections initialized');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Initialize database connection
connectToMongoDB();

// API Routes

// Get user by email
app.get('/api/users/email/:email', async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        department: user.department,
        specialization: user.specialization,
        phone: user.phone,
        student_id: user.student_id,
        employee_id: user.employee_id,
        expertise: user.expertise || [],
        experience_level: user.experience_level || 'junior',
        availability_status: user.availability_status || 'available',
        max_students: user.max_students,
        current_students: user.current_students || 0,
        created_at: user.created_at.toISOString(),
        updated_at: user.updated_at.toISOString(),
      }
    });
  } catch (error) {
    console.error('Error getting user by email:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        department: user.department,
        specialization: user.specialization,
        phone: user.phone,
        student_id: user.student_id,
        employee_id: user.employee_id,
        expertise: user.expertise || [],
        experience_level: user.experience_level || 'junior',
        availability_status: user.availability_status || 'available',
        max_students: user.max_students,
        current_students: user.current_students || 0,
        created_at: user.created_at.toISOString(),
        updated_at: user.updated_at.toISOString(),
      }
    });
  } catch (error) {
    console.error('Error getting user by ID:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await db.collection('users').find({}).toArray();

    // Calculate current_students for guides by counting unique students with active assignments
    const formattedUsers = await Promise.all(users.map(async (user) => {
      const userId = user._id.toString();
      let currentStudents = user.current_students || 0;
      
      // For guides, calculate current_students from unique students with active assignments
      if (user.role === 'guide') {
        const uniqueStudents = await db.collection('guide_assignments').distinct('student_id', {
          guide_id: userId,
          status: 'active'
        });
        currentStudents = uniqueStudents.length;
      }

      return {
        id: userId,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        department: user.department,
        specialization: user.specialization,
        phone: user.phone,
        student_id: user.student_id,
        employee_id: user.employee_id,
        expertise: user.expertise || [],
        experience_level: user.experience_level || 'junior',
        availability_status: user.availability_status || 'available',
        max_students: user.max_students,
        current_students: currentStudents,
        created_at: (user.created_at ? new Date(user.created_at) : new Date()).toISOString(),
        updated_at: (user.updated_at ? new Date(user.updated_at) : new Date()).toISOString(),
      };
    }));

    res.json({ success: true, users: formattedUsers });
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get guides
app.get('/api/users/guides', async (req, res) => {
  try {
    const guides = await db.collection('users').find({ role: 'guide' }).toArray();

    // Calculate current_students for each guide by counting unique students with active assignments
    const formattedGuides = await Promise.all(guides.map(async (guide) => {
      const guideId = guide._id.toString();
      
      // Count unique students with active assignments for this guide
      const uniqueStudents = await db.collection('guide_assignments').distinct('student_id', {
        guide_id: guideId,
        status: 'active'
      });
      const assignmentCount = uniqueStudents.length;

      return {
        id: guideId,
        email: guide.email,
        full_name: guide.full_name,
        role: guide.role,
        department: guide.department,
        specialization: guide.specialization,
        phone: guide.phone,
        student_id: guide.student_id,
        employee_id: guide.employee_id,
        expertise: guide.expertise || [],
        experience_level: guide.experience_level || 'junior',
        availability_status: guide.availability_status || 'available',
        max_students: guide.max_students,
        current_students: assignmentCount,
        created_at: (guide.created_at ? new Date(guide.created_at) : new Date()).toISOString(),
        updated_at: (guide.updated_at ? new Date(guide.updated_at) : new Date()).toISOString(),
      };
    }));

    res.json({ success: true, guides: formattedGuides });
  } catch (error) {
    console.error('Error getting guides:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get students
app.get('/api/users/students', async (req, res) => {
  try {
    const students = await db.collection('users').find({ role: 'student' }).toArray();

    const formattedStudents = students.map(student => {
      try {
        return {
          id: student._id.toString(),
          email: student.email || '',
          full_name: student.full_name || 'Unknown Student',
          role: student.role,
          department: student.department || '',
          specialization: student.specialization || '',
          phone: student.phone || '',
          student_id: student.student_id || '',
          employee_id: student.employee_id || '',
          expertise: student.expertise || [],
          experience_level: student.experience_level || 'junior',
          availability_status: student.availability_status || 'available',
          max_students: student.max_students || 0,
          current_students: student.current_students || 0,
          created_at: (student.created_at ? new Date(student.created_at) : new Date()).toISOString(),
          updated_at: (student.updated_at ? new Date(student.updated_at) : new Date()).toISOString(),
        };
      } catch (mapError) {
        console.error('Error formatting student:', student._id, mapError);
        return null;
      }
    }).filter(student => student !== null);

    res.json({ success: true, students: formattedStudents });
  } catch (error) {
    console.error('Error getting students:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Get pending users
app.get('/api/pending-users', async (req, res) => {
  try {
    const pendingUsers = await db.collection('pending_users').find({}).toArray();

    const formattedPendingUsers = pendingUsers.map(user => ({
      id: user._id.toString(),
      email: user.email,
      full_name: user.full_name,
      department: user.department,
      specialization: user.specialization,
      phone: user.phone,
      student_id: user.student_id,
      employee_id: user.employee_id,
      requested_role: user.requested_role,
      status: user.status,
      requested_at: user.requested_at.toISOString(),
      reviewed_at: user.reviewed_at?.toISOString(),
      reviewed_by: user.reviewed_by,
      rejection_reason: user.rejection_reason,
    }));

    res.json({ success: true, pendingUsers: formattedPendingUsers });
  } catch (error) {
    console.error('Error getting pending users:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Register pending user
app.post('/api/register-pending-user', async (req, res) => {
  try {
    const userData = req.body;

    // Check if user already exists (and handle missing email)
    const existingUser = userData.email ? await db.collection('users').findOne({ email: userData.email.toLowerCase() }) : null;
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.'
      });
    }

    // Check if already pending
    const existingPending = userData.email ? await db.collection('pending_users').findOne({ email: userData.email.toLowerCase() }) : null;
    if (existingPending) {
      return res.status(400).json({
        success: false,
        message: 'Registration request already pending approval.'
      });
    }

    // Hash the provided password
    const hashedPassword = await bcrypt.hash(userData.password || '', saltRounds);

    const newPendingUser = {
      ...userData,
      email: userData.email ? userData.email.toLowerCase() : '',
      password: hashedPassword, // Store the hashed password
      requested_at: new Date(),
      status: 'pending',
    };

    // Remove password from the response (don't send it back to client)
    const pendingUserResponse = { ...newPendingUser };
    delete pendingUserResponse.password;

    const result = await db.collection('pending_users').insertOne(newPendingUser);

    res.json({
      success: true,
      message: 'Registration request submitted successfully. Please wait for admin approval.',
      pendingUser: {
        ...pendingUserResponse,
        id: result.insertedId.toString(),
        requested_at: newPendingUser.requested_at.toISOString(),
      }
    });
  } catch (error) {
    console.error('Error registering pending user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Approve pending user
app.post('/api/approve-pending-user', async (req, res) => {
  try {
    const { pendingUserId, approvedBy } = req.body;

    if (!pendingUserId || !approvedBy) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: pendingUserId and approvedBy'
      });
    }

    const pendingUser = await db.collection('pending_users').findOne({ _id: new ObjectId(pendingUserId) });
    if (!pendingUser) {
      return res.status(404).json({
        success: false,
        message: 'Pending user not found'
      });
    }

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email: pendingUser.email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Use the password that was stored during registration
    const userPassword = pendingUser.password;

    // Create new user
    const newUser = {
      email: pendingUser.email.toLowerCase(),
      full_name: pendingUser.full_name,
      role: pendingUser.requested_role,
      department: pendingUser.department,
      specialization: pendingUser.specialization,
      phone: pendingUser.phone,
      student_id: pendingUser.student_id,
      employee_id: pendingUser.employee_id,
      password: userPassword, // Use the password from registration
      expertise: [],
      experience_level: 'junior',
      availability_status: 'available',
      max_students: pendingUser.requested_role === 'guide' ? 8 : null,
      current_students: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const userResult = await db.collection('users').insertOne(newUser);

    // Remove the pending user entry since they've been approved and moved to users collection
    const deleteResult = await db.collection('pending_users').deleteOne(
      { _id: new ObjectId(pendingUserId) }
    );

    if (deleteResult.deletedCount === 0) {
      console.warn('Warning: Pending user deletion failed, but user was created in users collection');
    } else {
      console.log('Successfully removed pending user entry after approval');
    }

    res.json({
      success: true,
      message: 'User approved successfully',
      user: { // The user object returned here won't have the password, which is fine for the client.
        ...newUser,
        id: userResult.insertedId.toString(),
        created_at: newUser.created_at.toISOString(),
        updated_at: newUser.updated_at.toISOString(),
      }
    });
  } catch (error) {
    console.error('Error approving pending user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Reject pending user
app.post('/api/reject-pending-user', async (req, res) => {
  try {
    const { pendingUserId, rejectedBy, reason } = req.body;

    const result = await db.collection('pending_users').updateOne(
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
      return res.status(404).json({
        success: false,
        message: 'Pending user not found'
      });
    }

    res.json({
      success: true,
      message: 'User registration rejected successfully'
    });
  } catch (error) {
    console.error('Error rejecting pending user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Authenticate user
app.post('/api/authenticate', async (req, res) => {
  try {
    const { email, password } = req.body;

    // First, check if user exists in 'users' collection (approved users)
    const user = await db.collection('users').findOne({ email: email.toLowerCase() });

    if (user) {
      // User is approved, validate credentials
      let passwordMatch = false;

      if (user.password) {
        if (user.password.startsWith('$')) {
          // Password is hashed with bcrypt
          passwordMatch = await bcrypt.compare(password, user.password);
        } else {
          // Password is stored as plain text (for backward compatibility)
          passwordMatch = password === user.password;

          // If plain text matches, hash it for security
          if (passwordMatch) {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            await db.collection('users').updateOne(
              { _id: user._id },
              { $set: { password: hashedPassword, updated_at: new Date() } }
            );
          }
        }
      }

      if (!passwordMatch) {
        return res.json({
          success: false,
          message: 'Invalid password. Please try again.'
        });
      }

      // Successful login
      res.json({
        success: true,
        user: {
          id: user._id.toString(),
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          department: user.department,
          specialization: user.specialization,
          phone: user.phone,
          student_id: user.student_id,
          employee_id: user.employee_id,
          expertise: user.expertise || [],
          experience_level: user.experience_level || 'junior',
          availability_status: user.availability_status || 'available',
          max_students: user.max_students,
          current_students: user.current_students || 0,
          created_at: user.created_at.toISOString(),
          updated_at: user.updated_at.toISOString(),
        }
      });
    } else {
      // User not in approved users, check if pending approval
      const pendingUser = await db.collection('pending_users').findOne({ email: email.toLowerCase() });

      if (pendingUser) {
        return res.json({
          success: false,
          message: 'Account is pending admin approval. Please wait for approval before logging in.',
          requiresApproval: true
        });
      } else {
        // User not found in either collection
        return res.json({
          success: false,
          message: 'User not found. Please register for an account.',
          requiresRegistration: true
        });
      }
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.id;
    delete updates.created_at;

    // Hash password if provided
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, saltRounds);
    }

    // Update updated_at
    updates.updated_at = new Date();

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get updated user
    const updatedUser = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    res.json({
      success: true,
      user: {
        id: updatedUser._id.toString(),
        email: updatedUser.email,
        full_name: updatedUser.full_name,
        role: updatedUser.role,
        department: updatedUser.department,
        specialization: updatedUser.specialization,
        phone: updatedUser.phone,
        student_id: updatedUser.student_id,
        employee_id: updatedUser.employee_id,
        expertise: updatedUser.expertise || [],
        experience_level: updatedUser.experience_level || 'junior',
        availability_status: updatedUser.availability_status || 'available',
        max_students: updatedUser.max_students,
        current_students: updatedUser.current_students || 0,
        created_at: updatedUser.created_at.toISOString(),
        updated_at: updatedUser.updated_at.toISOString(),
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate the user ID format before proceeding
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format.' });
    }

    // Get the user to verify existence
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    // Prevent deletion of Department Coordinator user
    if (user.role === 'coordinator' && user.full_name === 'Department Coordinator') {
      return res.json({ success: false, message: 'Deletion of Department Coordinator is not allowed.' });
    }

    // Prevent deletion of Senior Guide user
    if (user.role === 'guide' && user.full_name === 'Senior Guide') {
      return res.json({ success: false, message: 'Deletion of Senior Guide is not allowed.' });
    }

    const result = await db.collection('users').deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 0) {
      return res.json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete pending user
app.delete('/api/pending-users/:id', async (req, res) => {
  try {
    const pendingUserId = req.params.id;

    const result = await db.collection('pending_users').deleteOne({ _id: new ObjectId(pendingUserId) });

    if (result.deletedCount === 0) {
      return res.json({ success: false, message: 'Pending user not found' });
    }

    res.json({ success: true, message: 'Pending user deleted successfully' });
  } catch (error) {
    console.error('Error deleting pending user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Submit a new project (student)
app.post('/api/projects', async (req, res) => {
  try {
    const { student_id, title, description, specialization, keywords } = req.body;
    
    if (!student_id || !title || !description) {
      return res.status(400).json({ success: false, message: 'student_id, title, and description are required' });
    }
    
    // Check if student already has a project
    const existingProject = await db.collection('topics').findOne({ student_id });
    if (existingProject) {
      return res.status(400).json({ success: false, message: 'Student already has a project submitted' });
    }
    
    const newProject = {
      student_id,
      title,
      description,
      specialization: specialization || '',
      keywords: keywords || [],
      status: 'in_progress',
      approval_status: 'pending',
      marks: null,
      feedback: '',
      guide_id: null,
      coordinator_id: null,
      submitted_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    const result = await db.collection('topics').insertOne(newProject);
    
    console.log(`📝 New project submitted by student ${student_id}: ${title}`);
    
    res.json({ 
      success: true, 
      message: 'Project submitted successfully',
      project: {
        id: result.insertedId.toString(),
        ...newProject
      }
    });
  } catch (error) {
    console.error('Error submitting project:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update a project (student or guide)
app.put('/api/projects/:projectId', async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { title, description, specialization, keywords } = req.body;
    
    const update = {
      updated_at: new Date(),
    };
    
    if (title) update.title = title;
    if (description) update.description = description;
    if (specialization !== undefined) update.specialization = specialization;
    if (keywords !== undefined) update.keywords = keywords;
    
    const result = await db.collection('topics').updateOne(
      { _id: new ObjectId(projectId) },
      { $set: update }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    console.log(`✏️  Project ${projectId} updated`);
    
    res.json({ success: true, message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get all student projects
app.get('/api/student-projects', async (req, res) => {
  try {
    const projects = await db.collection('topics').find({}).toArray();
    const formattedProjects = projects.map(project => ({
      id: project._id.toString(),
      student_id: project.student_id,
      title: project.title,
      description: project.description,
      specialization: project.specialization || '',
      status: project.status || 'in_progress',
      guide_id: project.guide_id || null,
      coordinator_id: project.coordinator_id || null,
      marks: project.marks ?? null,
      feedback: project.feedback || '',
      approval_status: project.approval_status || 'pending',
      submitted_at: project.submitted_at ? new Date(project.submitted_at).toISOString() : null,
      created_at: (project.created_at ? new Date(project.created_at) : new Date()).toISOString(),
      updated_at: (project.updated_at ? new Date(project.updated_at) : new Date()).toISOString(),
    }));

    res.json({ success: true, projects: formattedProjects });
  } catch (error) {
    console.error('Error getting student projects:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Assign guide to multiple students (group allocation)
app.post('/api/assignments/guide/group', async (req, res) => {
  try {
    const { student_ids, guide_id, assignment_reason } = req.body;
    
    console.log(`📋 Group allocation request received:`);
    console.log(`   Guide ID: ${guide_id}`);
    console.log(`   Student IDs:`, student_ids);
    
    if (!student_ids || !Array.isArray(student_ids) || student_ids.length === 0) {
      return res.status(400).json({ success: false, message: 'student_ids array is required' });
    }
    
    if (!guide_id) {
      return res.status(400).json({ success: false, message: 'guide_id is required' });
    }
    
    // Verify guide exists
    const guide = await db.collection('users').findOne({ _id: new ObjectId(guide_id), role: 'guide' });
    if (!guide) {
      return res.status(404).json({ success: false, message: 'Guide not found' });
    }
    
    const assignments = [];
    const errors = [];
    
    // Assign guide to each student's project
    for (const student_id of student_ids) {
      try {
        console.log(`🔍 Looking for project with student_id: ${student_id}`);
        
        // Find student's project - try both string and ObjectId formats
        let project = await db.collection('topics').findOne({ student_id });
        
        // If not found and student_id looks like ObjectId, try as ObjectId
        if (!project && ObjectId.isValid(student_id)) {
          console.log(`   Trying as ObjectId...`);
          project = await db.collection('topics').findOne({ student_id: new ObjectId(student_id) });
        }
        
        // If still not found, try finding by user's _id
        if (!project) {
          console.log(`   Trying to find student by _id...`);
          const student = await db.collection('users').findOne({ _id: new ObjectId(student_id) });
          if (student && student.student_id) {
            console.log(`   Found student with student_id: ${student.student_id}`);
            project = await db.collection('topics').findOne({ student_id: student.student_id });
          }
        }
        
        // If no project exists, create a placeholder project
        if (!project) {
          console.log(`Creating placeholder project for student ${student_id}`);
          
          // Get student info
          const student = await db.collection('users').findOne({ student_id });
          
          const newProject = {
            student_id,
            title: `${student ? student.full_name + "'s" : 'Student'} Research Project`,
            description: 'Project details to be submitted by student',
            specialization: student?.specialization || '',
            keywords: [],
            status: 'in_progress',
            approval_status: 'pending',
            marks: null,
            feedback: '',
            guide_id: guide_id,
            coordinator_id: null,
            submitted_at: new Date(),
            created_at: new Date(),
            updated_at: new Date(),
          };
          
          const result = await db.collection('topics').insertOne(newProject);
          project = { _id: result.insertedId, ...newProject };
          
          console.log(`✅ Created placeholder project for student ${student_id}`);
        } else {
          // Update existing project with guide
          await db.collection('topics').updateOne(
            { _id: project._id },
            {
              $set: {
                guide_id: guide_id,
                updated_at: new Date(),
              }
            }
          );
        }
        
        // Check if assignment already exists
        const existingAssignment = await db.collection('guide_assignments').findOne({
          student_id,
          guide_id,
          status: 'active'
        });
        
        if (!existingAssignment) {
          // Create new assignment
          const assignment = {
            student_id,
            project_id: project._id.toString(),
            guide_id,
            assigned_at: new Date(),
            assignment_reason: assignment_reason || 'group_allocation',
            status: 'active'
          };
          
          await db.collection('guide_assignments').insertOne(assignment);
          assignments.push(assignment);
        } else {
          console.log(`ℹ️  Assignment already exists for student ${student_id}`);
          assignments.push(existingAssignment);
        }
        
        console.log(`✅ Assigned guide to student ${student_id}`);
        
      } catch (error) {
        console.error(`❌ Error assigning guide to student ${student_id}:`, error);
        console.error(`   Error details:`, error.message);
        console.error(`   Stack:`, error.stack);
        errors.push({ student_id, error: error.message });
      }
    }
    
    console.log(`\n📊 Assignment Results:`);
    console.log(`   Total: ${student_ids.length}`);
    console.log(`   Successful: ${assignments.length}`);
    console.log(`   Failed: ${errors.length}`);
    if (errors.length > 0) {
      console.log(`\n❌ Errors:`);
      errors.forEach(err => {
        console.log(`   - Student ${err.student_id}: ${err.error}`);
      });
    }
    
    const successCount = assignments.length;
    const errorCount = errors.length;
    const totalCount = student_ids.length;
    
    let message = `Successfully assigned guide to ${successCount} student(s)`;
    if (errorCount > 0) {
      message += `. ${errorCount} assignment(s) failed.`;
    }
    
    console.log(`📊 Group assignment complete: ${successCount}/${totalCount} successful`);
    
    res.json({ 
      success: true, 
      assignments,
      errors,
      message,
      stats: {
        total: totalCount,
        successful: successCount,
        failed: errorCount
      }
    });
    
  } catch (error) {
    console.error('Error in group guide assignment:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Assign guide to a student's project
app.post('/api/assignments/guide', async (req, res) => {
  try {
    const { student_id, project_id, guide_id, assignment_reason } = req.body;
    if (!student_id || !project_id) {
      return res.status(400).json({ success: false, message: 'student_id and project_id are required' });
    }

    const projectObjectId = new ObjectId(project_id);
    let resolvedGuideId = guide_id || null;

    // Ensure project exists
    const project = await db.collection('topics').findOne({ _id: projectObjectId });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if project already has a guide assigned
    if (project.guide_id && !guide_id) {
      return res.json({ 
        success: true, 
        message: 'Project already has a guide assigned',
        assignment: {
          id: `existing_${project_id}`,
          student_id,
          project_id,
          guide_id: project.guide_id,
          assigned_at: project.updated_at || new Date(),
          assignment_reason: 'Previously assigned',
          status: 'active'
        }
      });
    }

    // Resolve or validate guide
    if (!resolvedGuideId) {
      // Auto-select guide: pick any guide for now; optionally match specialization
      const projectSpec = project.specialization || '';
      let guide = await db.collection('users').find({ role: 'guide' }).toArray();
      // naive specialization matching first
      const matching = guide.filter(g => (g.specialization || '').toLowerCase().includes(projectSpec.toLowerCase()));
      const list = matching.length > 0 ? matching : guide;
      if (list.length === 0) {
        return res.status(404).json({ success: false, message: 'No guides available for assignment' });
      }
      resolvedGuideId = list[0]._id.toString();
    } else {
      const guideObjectId = new ObjectId(resolvedGuideId);
      const guide = await db.collection('users').findOne({ _id: guideObjectId, role: 'guide' });
      if (!guide) {
        return res.status(404).json({ success: false, message: 'Guide not found' });
      }
    }

    // Update project with guide assignment
    await db.collection('topics').updateOne(
      { _id: projectObjectId },
      {
        $set: {
          guide_id: resolvedGuideId,
          updated_at: new Date(),
        }
      }
    );

    // Check if assignment already exists
    const existingAssignment = await db.collection('guide_assignments').findOne({
      student_id,
      guide_id: resolvedGuideId,
      status: 'active'
    });

    let assignment;
    if (existingAssignment) {
      // Return existing assignment
      assignment = {
        id: existingAssignment._id.toString(),
        student_id: existingAssignment.student_id,
        project_id: existingAssignment.project_id,
        guide_id: existingAssignment.guide_id,
        assigned_at: existingAssignment.assigned_at,
        assignment_reason: existingAssignment.assignment_reason,
        status: existingAssignment.status
      };
    } else {
      // Create new assignment
      const newAssignment = {
        student_id,
        project_id,
        guide_id: resolvedGuideId,
        assigned_at: new Date(),
        assignment_reason: assignment_reason || 'automatic',
        status: 'active'
      };
      const result = await db.collection('guide_assignments').insertOne(newAssignment);
      assignment = { id: result.insertedId.toString(), ...newAssignment };
    }

    res.json({ success: true, assignment });
  } catch (error) {
    console.error('Error assigning guide:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Assign coordinator to a student's project
app.post('/api/assignments/coordinator', async (req, res) => {
  try {
    const { student_id, project_id, coordinator_id } = req.body;
    if (!student_id || !project_id || !coordinator_id) {
      return res.status(400).json({ success: false, message: 'student_id, project_id and coordinator_id are required' });
    }

    const projectObjectId = new ObjectId(project_id);
    const coordObjectId = new ObjectId(coordinator_id);

    // Ensure project exists
    const project = await db.collection('topics').findOne({ _id: projectObjectId });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Ensure coordinator exists
    const coordinator = await db.collection('users').findOne({ _id: coordObjectId, role: 'coordinator' });
    if (!coordinator) {
      return res.status(404).json({ success: false, message: 'Coordinator not found' });
    }

    // Update project with coordinator assignment
    await db.collection('topics').updateOne(
      { _id: projectObjectId },
      {
        $set: {
          coordinator_id: coordinator_id,
          updated_at: new Date(),
        }
      }
    );

    // Log coordinator assignment
    const assignment = {
      student_id,
      project_id,
      coordinator_id,
      assigned_at: new Date(),
      status: 'active'
    };
    const result = await db.collection('coordinator_assignments').insertOne(assignment);

    res.json({ success: true, assignment: { id: result.insertedId.toString(), ...assignment } });
  } catch (error) {
    console.error('Error assigning coordinator:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get all students assigned to a guide (with project info)
app.get('/api/guides/:guideId/students', async (req, res) => {
  try {
    const guideId = req.params.guideId;
    console.log(`📋 Getting students for guide: ${guideId}`);
    
    const projects = await db.collection('topics').find({ guide_id: guideId }).toArray();
    console.log(`   Found ${projects.length} project(s)`);
    
    if (projects.length === 0) {
      return res.json({ success: true, students: [] });
    }
    
    const studentIds = projects.map(p => p.student_id).filter(Boolean);
    console.log(`   Student IDs:`, studentIds);
    
    // Find users by student_id field OR _id (handle both cases)
    const usersByStudentId = await db.collection('users').find({ student_id: { $in: studentIds } }).toArray();
    
    // Also try to find by _id for cases where student_id is actually the user's _id
    const objectIdStudentIds = studentIds.filter(id => ObjectId.isValid(id));
    const usersByObjectId = objectIdStudentIds.length > 0 
      ? await db.collection('users').find({ _id: { $in: objectIdStudentIds.map(id => new ObjectId(id)) } }).toArray()
      : [];
    
    // Combine both results
    const users = [...usersByStudentId, ...usersByObjectId];
    console.log(`   Found ${users.length} user(s)`);

    const result = projects.map(p => ({
      project: {
        id: p._id.toString(),
        title: p.title,
        description: p.description,
        specialization: p.specialization || '',
        status: p.status || 'in_progress',
        marks: p.marks ?? null,
        approval_status: p.approval_status || 'pending',
        updated_at: (p.updated_at ? new Date(p.updated_at) : new Date()).toISOString(),
      },
      student: (() => {
        // Match by student_id field first
        let u = users.find(user => user.student_id === p.student_id);
        // If not found, try matching by _id
        if (!u && ObjectId.isValid(p.student_id)) {
          u = users.find(user => user._id.toString() === p.student_id);
        }
        return u ? {
          id: u._id.toString(),
          full_name: u.full_name,
          email: u.email,
          department: u.department,
          specialization: u.specialization,
          student_id: u.student_id,
        } : null;
      })()
    }));

    console.log(`✅ Returning ${result.length} student(s)`);
    res.json({ success: true, students: result });
  } catch (error) {
    console.error('❌ Error getting guide students:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get guide info for a student
app.get('/api/students/:studentId/guide', async (req, res) => {
  try {
    const studentId = req.params.studentId;
    console.log(`[DEBUG] Getting guide for student: ${studentId}`);
    
    // Find project by student_id (string match)
    const project = await db.collection('topics').findOne({ student_id: studentId });
    console.log(`[DEBUG] Project found:`, project ? `Yes (guide_id: ${project.guide_id})` : 'No');
    
    if (!project || !project.guide_id) {
      return res.json({ success: true, guide: null });
    }
    
    // Try to find guide - handle both ObjectId and string formats
    let guide;
    try {
      // First try as ObjectId
      guide = await db.collection('users').findOne({ _id: new ObjectId(project.guide_id) });
      console.log(`[DEBUG] Guide found via ObjectId:`, guide ? guide.full_name : 'No');
    } catch (e) {
      // If that fails, try as string (in case _id is stored as string)
      console.log(`[DEBUG] ObjectId failed, trying string lookup`);
      guide = await db.collection('users').findOne({ _id: project.guide_id });
      console.log(`[DEBUG] Guide found via string:`, guide ? guide.full_name : 'No');
    }
    
    if (!guide) {
      console.log(`[ERROR] Guide not found for guide_id: ${project.guide_id}`);
      return res.json({ success: true, guide: null });
    }
    
    console.log(`[SUCCESS] Returning guide: ${guide.full_name}`);
    
    res.json({ success: true, guide: {
      id: guide._id.toString(),
      email: guide.email,
      full_name: guide.full_name,
      role: guide.role,
      department: guide.department,
      specialization: guide.specialization,
      phone: guide.phone,
    }});
  } catch (error) {
    console.error('Error getting student guide:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get coordinator info for a student
app.get('/api/students/:studentId/coordinator', async (req, res) => {
  try {
    const studentId = req.params.studentId;
    
    // Find project by student_id (string match)
    const project = await db.collection('topics').findOne({ student_id: studentId });
    
    if (!project || !project.coordinator_id) {
      return res.json({ success: true, coordinator: null });
    }
    
    // Try to find coordinator - handle both ObjectId and string formats
    let user;
    try {
      // First try as ObjectId
      user = await db.collection('users').findOne({ _id: new ObjectId(project.coordinator_id) });
    } catch (e) {
      // If that fails, try as string
      user = await db.collection('users').findOne({ _id: project.coordinator_id });
    }
    
    if (!user) {
      console.log(`Coordinator not found for coordinator_id: ${project.coordinator_id}`);
      return res.json({ success: true, coordinator: null });
    }
    
    res.json({ success: true, coordinator: {
      id: user._id.toString(),
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      department: user.department,
      specialization: user.specialization,
      phone: user.phone,
    }});
  } catch (error) {
    console.error('Error getting student coordinator:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get students for a coordinator
app.get('/api/coordinators/:coordId/students', async (req, res) => {
  try {
    const coordId = req.params.coordId;
    console.log(`📋 Getting students for coordinator: ${coordId}`);
    
    const projects = await db.collection('topics').find({ coordinator_id: coordId }).toArray();
    console.log(`   Found ${projects.length} project(s)`);
    
    if (projects.length === 0) {
      return res.json({ success: true, students: [] });
    }
    
    const studentIds = projects.map(p => p.student_id).filter(Boolean);
    console.log(`   Student IDs:`, studentIds);
    
    // Find users by student_id field OR _id (handle both cases)
    const usersByStudentId = await db.collection('users').find({ student_id: { $in: studentIds } }).toArray();
    
    // Also try to find by _id for cases where student_id is actually the user's _id
    const objectIdStudentIds = studentIds.filter(id => ObjectId.isValid(id));
    const usersByObjectId = objectIdStudentIds.length > 0 
      ? await db.collection('users').find({ _id: { $in: objectIdStudentIds.map(id => new ObjectId(id)) } }).toArray()
      : [];
    
    // Combine both results
    const users = [...usersByStudentId, ...usersByObjectId];
    console.log(`   Found ${users.length} user(s)`);
    
    const result = projects.map(p => ({
      project: {
        id: p._id.toString(),
        title: p.title,
        status: p.status || 'in_progress',
        approval_status: p.approval_status || 'pending',
        updated_at: (p.updated_at ? new Date(p.updated_at) : new Date()).toISOString(),
      },
      student: (() => {
        // Match by student_id field first
        let u = users.find(user => user.student_id === p.student_id);
        // If not found, try matching by _id
        if (!u && ObjectId.isValid(p.student_id)) {
          u = users.find(user => user._id.toString() === p.student_id);
        }
        return u ? {
          id: u._id.toString(),
          full_name: u.full_name,
          email: u.email,
          department: u.department,
          specialization: u.specialization,
          student_id: u.student_id,
        } : null;
      })()
    }));
    
    res.json({ success: true, students: result });
  } catch (error) {
    console.error('Error getting coordinator students:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get projects assigned to a guide
app.get('/api/guides/:guideId/projects', async (req, res) => {
  try {
    const guideId = req.params.guideId;
    const projects = await db.collection('topics').find({ $or: [{ guide_id: guideId }, { guide_id: { $exists: false } }] }).toArray();
    const formatted = projects.map(p => ({
      id: p._id.toString(),
      student_id: p.student_id,
      title: p.title,
      description: p.description,
      specialization: p.specialization || '',
      status: p.status || 'in_progress',
      submitted_at: p.submitted_at ? new Date(p.submitted_at).toISOString() : null,
      guide_id: p.guide_id || null,
      marks: p.marks ?? null,
      feedback: p.feedback || '',
      approval_status: p.approval_status || 'pending',
      created_at: (p.created_at ? new Date(p.created_at) : new Date()).toISOString(),
      updated_at: (p.updated_at ? new Date(p.updated_at) : new Date()).toISOString(),
    }));
    res.json({ success: true, projects: formatted });
  } catch (error) {
    console.error('Error getting guide projects:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Review/grade a project (guide only)
app.put('/api/projects/:projectId/review', async (req, res) => {
  try {
    const { marks, feedback, approval_status } = req.body;
    const projectId = req.params.projectId;

    const update = {
      updated_at: new Date(),
    };
    if (typeof marks === 'number') update.marks = marks;
    if (typeof feedback === 'string') update.feedback = feedback;
    if (approval_status) {
      update.approval_status = approval_status;
      update.status = approval_status === 'approved' ? 'approved' : (approval_status === 'rejected' ? 'rejected' : 'needs_revision');
    }

    const result = await db.collection('topics').updateOne({ _id: new ObjectId(projectId) }, { $set: update });
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, message: 'Project review updated' });
  } catch (error) {
    console.error('Error reviewing project:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete a project (guide permission allowed// Delete a project
app.delete('/api/projects/:projectId', async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const result = await db.collection('topics').deleteOne({ _id: new ObjectId(projectId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete all projects (admin only - use with caution!)
app.delete('/api/projects', async (req, res) => {
  try {
    const result = await db.collection('topics').deleteMany({});
    await db.collection('guide_assignments').deleteMany({});
    await db.collection('coordinator_assignments').deleteMany({});
    
    console.log(`Deleted ${result.deletedCount} project(s) and all assignments`);
    
    res.json({ 
      success: true, 
      message: `Deleted ${result.deletedCount} project(s) and all assignments`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting all projects:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ==================== MILESTONE ENDPOINTS ====================

// Get milestones for a topic
app.get('/api/topics/:topicId/milestones', async (req, res) => {
  try {
    const { topicId } = req.params;
    const { userId, userRole } = req.query;
    
    // Get the topic/project to check guide assignment
    const topic = await db.collection('topics').findOne({ _id: new ObjectId(topicId) });
    
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    // Access control: Check if user has permission to view this project's milestones
    if (userRole === 'guide') {
      // For guides, check if they are assigned to this project
      const isAssignedGuide = topic.guide_id === userId || topic.co_guide_id === userId;
      
      if (!isAssignedGuide) {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied. You are not assigned as the guide for this student.',
          accessDenied: true
        });
      }
    } else if (userRole === 'student') {
      // For students, check if this is their own project
      // userId could be either the user's _id or student_id, so we need to check both
      let isOwnProject = topic.student_id === userId;
      
      // If not matched, try to find the user by _id and compare student_id
      if (!isOwnProject && ObjectId.isValid(userId)) {
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        if (user && user.student_id) {
          isOwnProject = topic.student_id === user.student_id;
        }
        // Also check if topic.student_id is the user's _id
        if (!isOwnProject) {
          isOwnProject = topic.student_id === user._id.toString();
        }
      }
      
      if (!isOwnProject) {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied. You can only view your own progress.',
          accessDenied: true
        });
      }
    }
    // Admin and coordinator have full access (no check needed)
    
    const milestones = await db.collection('milestones').find({ topic_id: topicId }).sort({ due_date: 1 }).toArray();
    
    const formatted = milestones.map(m => ({
      id: m._id.toString(),
      topic_id: m.topic_id,
      title: m.title,
      description: m.description,
      due_date: m.due_date,
      completion_date: m.completion_date,
      status: m.status,
      documents: m.documents || [],
      feedback: m.feedback,
      grade: m.grade,
      created_at: m.created_at,
      updated_at: m.updated_at,
    }));
    
    res.json({ success: true, milestones: formatted });
  } catch (error) {
    console.error('Error getting milestones:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create or initialize milestones for a topic
app.post('/api/topics/:topicId/milestones/init', async (req, res) => {
  try {
    const { topicId } = req.params;
    
    // Check if milestones already exist
    const existing = await db.collection('milestones').findOne({ topic_id: topicId });
    if (existing) {
      return res.json({ success: true, message: 'Milestones already initialized' });
    }
    
    // Create default milestones
    const defaultMilestones = [
      {
        topic_id: topicId,
        title: 'Literature Review',
        description: 'Complete comprehensive literature review and submit initial findings',
        due_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
        status: 'pending',
        documents: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        topic_id: topicId,
        title: 'Research Methodology',
        description: 'Develop and submit detailed research methodology including data collection methods',
        due_date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days
        status: 'pending',
        documents: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        topic_id: topicId,
        title: 'Data Collection',
        description: 'Collect primary and secondary data according to the approved methodology',
        due_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 180 days
        status: 'pending',
        documents: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        topic_id: topicId,
        title: 'Data Analysis',
        description: 'Analyze collected data and generate preliminary results',
        due_date: new Date(Date.now() + 240 * 24 * 60 * 60 * 1000).toISOString(), // 240 days
        status: 'pending',
        documents: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        topic_id: topicId,
        title: 'Draft Dissertation',
        description: 'Submit complete draft of dissertation for review',
        due_date: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString(), // 300 days
        status: 'pending',
        documents: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        topic_id: topicId,
        title: 'Final Submission',
        description: 'Submit final dissertation with all corrections incorporated',
        due_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 365 days
        status: 'pending',
        documents: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    
    await db.collection('milestones').insertMany(defaultMilestones);
    res.json({ success: true, message: 'Milestones initialized successfully' });
  } catch (error) {
    console.error('Error initializing milestones:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Upload document to milestone
app.post('/api/milestones/:milestoneId/documents', async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { documents, analyzerScore, analyzerFeedback, analyzerFormat, analyzerSimilarity } = req.body; // Array of document objects
    
    const updateData = { 
      $push: { documents: { $each: documents } },
      $set: { 
        status: 'in_progress',
        updated_at: new Date().toISOString()
      }
    };

    // If analyzer score is provided (Final Submission), store it
    if (analyzerScore !== undefined) {
      updateData.$set.analyzer_confidence_score = analyzerScore;
      if (analyzerFeedback) {
        updateData.$set.analyzer_feedback = analyzerFeedback;
      }
      if (analyzerFormat) {
        updateData.$set.analyzer_format = analyzerFormat;
      }
      if (analyzerSimilarity !== undefined) {
        updateData.$set.analyzer_similarity = analyzerSimilarity;
      }
    }
    
    const result = await db.collection('milestones').updateOne(
      { _id: new ObjectId(milestoneId) },
      updateData
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }
    
    res.json({ success: true, message: 'Documents uploaded successfully' });
  } catch (error) {
    console.error('Error uploading documents:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete document from milestone
app.delete('/api/milestones/:milestoneId/documents/:documentId', async (req, res) => {
  try {
    const { milestoneId, documentId } = req.params;
    
    const result = await db.collection('milestones').updateOne(
      { _id: new ObjectId(milestoneId) },
      { 
        $pull: { documents: { id: documentId } },
        $set: { updated_at: new Date().toISOString() }
      }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }
    
    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update milestone feedback and grade (guide only)
app.put('/api/milestones/:milestoneId/feedback', async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { feedback, grade, userId, userRole } = req.body;
    
    // Get the milestone to find its topic
    const milestone = await db.collection('milestones').findOne({ _id: new ObjectId(milestoneId) });
    
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }
    
    // Get the topic to check guide assignment
    const topic = await db.collection('topics').findOne({ _id: new ObjectId(milestone.topic_id) });
    
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    // Access control: Only assigned guide can provide feedback
    if (userRole === 'guide') {
      const isAssignedGuide = topic.guide_id === userId || topic.co_guide_id === userId;
      
      if (!isAssignedGuide) {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied. You are not assigned as the guide for this student.'
        });
      }
    }
    
    const update = {
      updated_at: new Date().toISOString()
    };
    
    if (feedback !== undefined) update.feedback = feedback;
    if (grade !== undefined) update.grade = grade;
    
    const result = await db.collection('milestones').updateOne(
      { _id: new ObjectId(milestoneId) },
      { $set: update }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }
    
    res.json({ success: true, message: 'Feedback updated successfully' });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Approve milestone (guide only or auto-approved for Final Submission)
app.put('/api/milestones/:milestoneId/approve', async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { userId, userRole, autoApproved, analyzerScore } = req.body;
    
    // Get the milestone to find its topic
    const milestone = await db.collection('milestones').findOne({ _id: new ObjectId(milestoneId) });
    
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }
    
    // Get the topic to check guide assignment
    const topic = await db.collection('topics').findOne({ _id: new ObjectId(milestone.topic_id) });
    
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    // Access control: Only assigned guide can approve (unless auto-approved)
    if (!autoApproved && userRole === 'guide') {
      const isAssignedGuide = topic.guide_id === userId || topic.co_guide_id === userId;
      
      if (!isAssignedGuide) {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied. You are not assigned as the guide for this student.'
        });
      }
    }

    // For auto-approved Final Submission, verify student access
    if (autoApproved && userRole === 'student') {
      if (topic.student_id !== userId) {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied. This is not your project.'
        });
      }
    }
    
    const updateData = { 
      status: 'completed',
      completion_date: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // If auto-approved with analyzer score, store the approval metadata
    if (autoApproved && analyzerScore !== undefined) {
      updateData.auto_approved = true;
      updateData.final_analyzer_score = analyzerScore;
      updateData.approved_at = new Date().toISOString();
    }
    
    const result = await db.collection('milestones').updateOne(
      { _id: new ObjectId(milestoneId) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }
    
    res.json({ success: true, message: 'Milestone approved successfully' });
  } catch (error) {
    console.error('Error approving milestone:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ============================================
// APPROVAL ENDPOINTS
// ============================================

// Get all approvals (with optional filtering)
app.get('/api/approvals', async (req, res) => {
  try {
    const { status, entity_type, approver_id } = req.query;
    
    // Build query filter
    const filter = {};
    if (status) filter.status = status;
    if (entity_type) filter.entity_type = entity_type;
    if (approver_id) filter.approver_id = approver_id;
    
    const approvals = await db.collection('approvals').find(filter).toArray();
    
    // Enrich approvals with entity details
    const enrichedApprovals = await Promise.all(approvals.map(async (approval) => {
      let entityDetails = null;
      
      try {
        if (approval.entity_type === 'topic') {
          const topic = await db.collection('topics').findOne({ _id: new ObjectId(approval.entity_id) });
          if (topic) {
            entityDetails = {
              title: topic.title,
              description: topic.description,
              student_id: topic.student_id
            };
          }
        } else if (approval.entity_type === 'assignment') {
          const assignment = await db.collection('guide_assignments').findOne({ _id: new ObjectId(approval.entity_id) });
          if (assignment) {
            entityDetails = {
              student_id: assignment.student_id,
              guide_id: assignment.guide_id
            };
          }
        }
      } catch (err) {
        console.warn('Error enriching approval:', err);
      }
      
      return {
        id: approval._id.toString(),
        entity_type: approval.entity_type,
        entity_id: approval.entity_id,
        approver_id: approval.approver_id,
        status: approval.status,
        comments: approval.comments || '',
        approved_at: approval.approved_at ? new Date(approval.approved_at).toISOString() : undefined,
        created_at: (approval.created_at ? new Date(approval.created_at) : new Date()).toISOString(),
        entity_details: entityDetails
      };
    }));
    
    res.json({ success: true, approvals: enrichedApprovals });
  } catch (error) {
    console.error('Error getting approvals:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create a new approval request
app.post('/api/approvals', async (req, res) => {
  try {
    const { entity_type, entity_id, approver_id, comments } = req.body;
    
    if (!entity_type || !entity_id || !approver_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'entity_type, entity_id, and approver_id are required' 
      });
    }
    
    const approval = {
      entity_type,
      entity_id,
      approver_id,
      status: 'pending',
      comments: comments || '',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const result = await db.collection('approvals').insertOne(approval);
    
    res.json({ 
      success: true, 
      message: 'Approval request created',
      approval: {
        id: result.insertedId.toString(),
        ...approval,
        created_at: approval.created_at.toISOString(),
        updated_at: approval.updated_at.toISOString()
      }
    });
  } catch (error) {
    console.error('Error creating approval:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Approve an approval request
app.put('/api/approvals/:approvalId/approve', async (req, res) => {
  try {
    const { approvalId } = req.params;
    const { comments } = req.body;
    
    const update = {
      status: 'approved',
      approved_at: new Date(),
      updated_at: new Date()
    };
    
    if (comments) {
      update.comments = comments;
    }
    
    const result = await db.collection('approvals').updateOne(
      { _id: new ObjectId(approvalId) },
      { $set: update }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'Approval not found' });
    }
    
    res.json({ success: true, message: 'Approval approved successfully' });
  } catch (error) {
    console.error('Error approving approval:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Reject an approval request
app.put('/api/approvals/:approvalId/reject', async (req, res) => {
  try {
    const { approvalId } = req.params;
    const { comments } = req.body;
    
    const update = {
      status: 'rejected',
      updated_at: new Date()
    };
    
    if (comments) {
      update.comments = comments;
    }
    
    const result = await db.collection('approvals').updateOne(
      { _id: new ObjectId(approvalId) },
      { $set: update }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'Approval not found' });
    }
    
    res.json({ success: true, message: 'Approval rejected successfully' });
  } catch (error) {
    console.error('Error rejecting approval:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Mark approval as requires changes
app.put('/api/approvals/:approvalId/requires-changes', async (req, res) => {
  try {
    const { approvalId } = req.params;
    const { comments } = req.body;
    
    const update = {
      status: 'requires_changes',
      updated_at: new Date()
    };
    
    if (comments) {
      update.comments = comments;
    }
    
    const result = await db.collection('approvals').updateOne(
      { _id: new ObjectId(approvalId) },
      { $set: update }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'Approval not found' });
    }
    
    res.json({ success: true, message: 'Approval marked as requires changes' });
  } catch (error) {
    console.error('Error updating approval:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// Catch all handler: send back React's index.html file for client-side routing
// Only for non-API routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend will be served from the same port`);
  console.log(`🔗 API endpoints available at http://localhost:${PORT}/api/`);
});
