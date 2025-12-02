import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'pg_dissertation_db';

const saltRounds = 10;

async function restoreDepartmentCoordinator() {
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const db = client.db(dbName);

    console.log('🔧 Restoring Department Coordinator user...');

    // Check if Department Coordinator already exists
    const existingUser = await db.collection('users').findOne({
      role: 'coordinator',
      full_name: 'Department Coordinator'
    });

    if (existingUser) {
      console.log('✅ Department Coordinator user already exists!');
      console.log(`🆔 User ID: ${existingUser._id.toString()}`);
      return;
    }

    // Hash the default password
    const hashedPassword = await bcrypt.hash('default123', saltRounds);

    // Create Department Coordinator user
    const coordinatorUser = {
      email: 'coordinator@university.edu',
      full_name: 'Department Coordinator',
      password: hashedPassword,
      role: 'coordinator',
      department: 'Computer Science',
      specialization: 'Project Management',
      phone: '+1-555-COORD',
      employee_id: 'COORD001',
      expertise: ['Project Coordination', 'Student Management'],
      experience_level: 'senior',
      availability_status: 'available',
      max_students: undefined,
      current_students: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await db.collection('users').insertOne(coordinatorUser);
    console.log('✅ Department Coordinator user restored successfully!');
    console.log(`🆔 User ID: ${result.insertedId}`);
    console.log(`📧 Email: coordinator@university.edu`);
    console.log(`🔑 Password: default123`);

  } catch (error) {
    console.error('❌ Error restoring Department Coordinator:', error);
  } finally {
    await client.close();
  }
}

restoreDepartmentCoordinator();
