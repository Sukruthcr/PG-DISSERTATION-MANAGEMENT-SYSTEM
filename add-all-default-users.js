import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'pg_dissertation_db';

const saltRounds = 10;

// Default users from passwordDatabase
const defaultUsers = [
  {
    email: 'admin@university.edu',
    full_name: 'System Administrator',
    password: 'admin123',
    role: 'admin',
    department: 'Administration',
    specialization: 'System Management',
    phone: '+1-555-ADMIN',
    employee_id: 'ADMIN001',
    expertise: ['System Administration', 'User Management'],
    experience_level: 'senior',
    availability_status: 'available',
    max_students: undefined,
    current_students: 0,
  },
  {
    email: 'coordinator@university.edu',
    full_name: 'Department Coordinator',
    password: 'coordinator123',
    role: 'coordinator',
    department: 'Computer Science',
    specialization: 'Academic Coordination',
    phone: '+1-555-COORD',
    employee_id: 'COORD001',
    expertise: ['Academic Planning', 'Student Affairs'],
    experience_level: 'senior',
    availability_status: 'available',
    max_students: undefined,
    current_students: 0,
  },
  {
    email: 'guide@university.edu',
    full_name: 'Senior Guide',
    password: 'XyZ9GuideSecureP@ss2024!',
    role: 'guide',
    department: 'Computer Science',
    specialization: 'Machine Learning',
    phone: '+1-555-GUIDE',
    employee_id: 'GUIDE001',
    expertise: ['Machine Learning', 'Data Science', 'AI'],
    experience_level: 'senior',
    availability_status: 'available',
    max_students: 8,
    current_students: 0,
  },
  {
    email: 'student@university.edu',
    full_name: 'Test Student',
    password: 'student123',
    role: 'student',
    department: 'Computer Science',
    specialization: 'Software Engineering',
    phone: '+1-555-STUD',
    student_id: 'STU001',
    expertise: [],
    experience_level: 'junior',
    availability_status: 'available',
    max_students: undefined,
    current_students: 0,
  },
  {
    email: 'ethics@university.edu',
    full_name: 'Ethics Committee Chair',
    password: 'ethics123',
    role: 'ethics_committee',
    department: 'Research Ethics',
    specialization: 'Research Ethics',
    phone: '+1-555-ETHICS',
    employee_id: 'ETHICS001',
    expertise: ['Research Ethics', 'Academic Integrity'],
    experience_level: 'senior',
    availability_status: 'available',
    max_students: undefined,
    current_students: 0,
  }
];

async function addAllDefaultUsers() {
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const db = client.db(dbName);

    console.log('🔧 Adding all default users to database...');

    for (const userData of defaultUsers) {
      // Check if user already exists
      const existingUser = await db.collection('users').findOne({ email: userData.email });

      if (existingUser) {
        // Update password if different (for security updates)
        const currentHashed = existingUser.password;
        const newHashedPassword = await bcrypt.hash(userData.password, saltRounds);
        if (currentHashed !== newHashedPassword) {
          await db.collection('users').updateOne(
            { email: userData.email },
            { 
              $set: { 
                password: newHashedPassword,
                updated_at: new Date()
              } 
            }
          );
          console.log(`🔄 ${userData.email} password updated successfully!`);
        } else {
          console.log(`✅ ${userData.email} already exists with correct password`);
        }
        continue;
      }

      // Hash the password before inserting
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Create user
      const newUser = {
        ...userData,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = await db.collection('users').insertOne(newUser);
      console.log(`✅ ${userData.email} created successfully!`);
      console.log(`   - Role: ${userData.role}, User ID: ${result.insertedId}`);
      console.log('');
    }

    // Check for any remaining pending users that should be cleaned up
    console.log('🧹 Checking for pending users that need cleanup...');
    const pendingUsers = await db.collection('pending_users').find({}).toArray();

    for (const pendingUser of pendingUsers) {
      const existingUser = await db.collection('users').findOne({ email: pendingUser.email });

      if (existingUser) {
        console.log(`🚨 Found duplicate: ${pendingUser.email} exists in both collections`);
        console.log(`   🗑️ Removing pending user: ${pendingUser._id}`);

        await db.collection('pending_users').deleteOne({ _id: pendingUser._id });
        console.log(`   ✅ Removed pending duplicate for ${pendingUser.email}`);
      }
    }

    console.log('🎉 All default users added successfully!');
    console.log('');
    console.log('📋 Summary of available accounts:');
    defaultUsers.forEach(user => {
      console.log(`   - ${user.email} / ${user.password} (${user.role})`);
    });

  } catch (error) {
    console.error('❌ Error adding users:', error);
  } finally {
    await client.close();
  }
}

addAllDefaultUsers();
