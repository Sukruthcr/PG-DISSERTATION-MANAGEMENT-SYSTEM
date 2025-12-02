import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'pg_dissertation_db';

const saltRounds = 10;

async function restoreSeniorGuide() {
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const db = client.db(dbName);

    console.log('🔧 Restoring Senior Guide user...');

    // Check if Senior Guide already exists
    const existingUser = await db.collection('users').findOne({
      role: 'guide',
      full_name: 'Senior Guide'
    });

    if (existingUser) {
      console.log('✅ Senior Guide user already exists!');
      console.log(`🆔 User ID: ${existingUser._id.toString()}`);
      return;
    }

    // Hash the guide password
    const hashedPassword = await bcrypt.hash('guide123', saltRounds);

    // Create Senior Guide user
    const guideUser = {
      email: 'guide@university.edu',
      full_name: 'Senior Guide',
      password: hashedPassword,
      role: 'guide',
      department: 'Computer Science',
      specialization: 'Machine Learning',
      phone: '+1-555-GUIDE',
      employee_id: 'GUIDE001',
      expertise: ['Machine Learning', 'Data Science', 'Python'],
      experience_level: 'senior',
      availability_status: 'available',
      max_students: 8,
      current_students: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await db.collection('users').insertOne(guideUser);
    console.log('✅ Senior Guide user restored successfully!');
    console.log(`🆔 User ID: ${result.insertedId}`);
    console.log(`📧 Email: guide@university.edu`);
    console.log(`🔑 Password: guide123`);

  } catch (error) {
    console.error('❌ Error restoring Senior Guide:', error);
  } finally {
    await client.close();
  }
}

restoreSeniorGuide();
