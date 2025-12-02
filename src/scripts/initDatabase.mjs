import { MongoClient } from 'mongodb';

async function initializeDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');

  try {
    await client.connect();
    const db = client.db('pg_dissertation_db');

    // Create collections if they don't exist
    const collections = ['users', 'pending_users', 'topics', 'guide_assignments'];
    for (const collectionName of collections) {
      await db.createCollection(collectionName);
    }

    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('pending_users').createIndex({ email: 1 }, { unique: true });

    // Add sample users
    const sampleUsers = [
      {
        email: 'admin@university.edu',
        full_name: 'System Administrator',
        role: 'admin',
        department: 'IT Administration',
        specialization: 'System Management',
        phone: '+1-555-0001',
        employee_id: 'ADM001',
        expertise: ['System Administration', 'Database Management', 'Security'],
        experience_level: 'expert',
        availability_status: 'available',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'coordinator@university.edu',
        full_name: 'Dr. Sarah Johnson',
        role: 'coordinator',
        department: 'Computer Science',
        specialization: 'Academic Coordination',
        phone: '+1-555-0002',
        employee_id: 'COO001',
        expertise: ['Academic Management', 'Research Coordination', 'Program Development'],
        experience_level: 'expert',
        availability_status: 'available',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'guide@university.edu',
        full_name: 'Dr. Michael Chen',
        role: 'guide',
        department: 'Computer Science',
        specialization: 'Machine Learning',
        phone: '+1-555-0003',
        employee_id: 'GDE001',
        expertise: ['Machine Learning', 'Deep Learning', 'Artificial Intelligence', 'Data Science'],
        max_students: 8,
        current_students: 3,
        experience_level: 'expert',
        availability_status: 'available',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'student@university.edu',
        full_name: 'John Doe',
        role: 'student',
        department: 'Computer Science',
        specialization: 'Data Science',
        phone: '+1-555-0004',
        student_id: 'CS2024001',
        expertise: [],
        experience_level: 'junior',
        availability_status: 'available',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'ethics@university.edu',
        full_name: 'Dr. Emily Rodriguez',
        role: 'ethics_committee',
        department: 'Research Ethics',
        specialization: 'Ethics Review',
        phone: '+1-555-0005',
        employee_id: 'ETH001',
        expertise: ['Research Ethics', 'Ethical Review', 'Compliance'],
        experience_level: 'expert',
        availability_status: 'available',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    // Insert sample users
    for (const user of sampleUsers) {
      try {
        await db.collection('users').insertOne(user);
      } catch (error) {
        console.log('User might already exist:', user.email);
      }
    }

    console.log('Database initialized successfully!');
    console.log('Sample users added:');
    console.log('- admin@university.edu (password: admin123)');
    console.log('- coordinator@university.edu (password: coordinator123)');
    console.log('- guide@university.edu (password: guide123)');
    console.log('- student@university.edu (password: student123)');
    console.log('- ethics@university.edu (password: ethics123)');

  } catch (error) {
    console.error('Database initialization error:', error);
  } finally {
    await client.close();
  }
}

// Run initialization if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase();
}

export { initializeDatabase };
