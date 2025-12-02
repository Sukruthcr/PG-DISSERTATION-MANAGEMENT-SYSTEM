import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'pg_dissertation_db';

const saltRounds = 10;

async function addAdminUser() {
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const db = client.db(dbName);

    console.log('🔧 Adding/updating admin user to database...');

    // Check if admin user already exists
    const existingUser = await db.collection('users').findOne({ email: 'admin@university.edu' });

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);

    if (existingUser) {
      console.log('✅ Admin user already exists, updating password...');
      await db.collection('users').updateOne(
        { email: 'admin@university.edu' },
        { $set: { password: hashedPassword } }
      );
      console.log('✅ Admin user password updated!');
    } else {
      // Create admin user
      const adminUser = {
        email: 'admin@university.edu',
        full_name: 'System Administrator',
        password: hashedPassword,
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
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = await db.collection('users').insertOne(adminUser);
      console.log('✅ Admin user created successfully!');
      console.log(`🆔 User ID: ${result.insertedId}`);
    }

    console.log(`📧 Email: admin@university.edu`);
    console.log(`🔑 Password: admin123`);

  } catch (error) {
    console.error('❌ Error adding admin user:', error);
  } finally {
    await client.close();
  }
}

addAdminUser();
