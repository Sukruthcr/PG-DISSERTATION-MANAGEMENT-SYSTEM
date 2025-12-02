import { MongoClient } from 'mongodb';

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'pg_dissertation_db';

async function checkTestUser() {
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const db = client.db(dbName);

    console.log('🔍 Checking test user testuser@university.edu...');

    // Check in pending_users collection
    const pendingUser = await db.collection('pending_users').findOne({ email: 'testuser@university.edu' });
    if (pendingUser) {
      console.log('⏳ User found in pending_users collection:');
      console.log('Email:', pendingUser.email);
      console.log('Full Name:', pendingUser.full_name);
      console.log('Status:', pendingUser.status);
      console.log('Requested Role:', pendingUser.requested_role);
      console.log('Password hash exists:', !!pendingUser.password);
      console.log('Password hash length:', pendingUser.password ? pendingUser.password.length : 0);
      return;
    }

    // Check in users collection
    const user = await db.collection('users').findOne({ email: 'testuser@university.edu' });
    if (user) {
      console.log('✅ User found in users collection:');
      console.log('Email:', user.email);
      console.log('Full Name:', user.full_name);
      console.log('Role:', user.role);
      console.log('Password hash exists:', !!user.password);
      console.log('Password hash length:', user.password ? user.password.length : 0);
      return;
    }

    console.log('❌ User not found in either collection');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkTestUser();
