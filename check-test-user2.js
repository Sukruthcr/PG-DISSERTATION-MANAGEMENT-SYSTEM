import { MongoClient } from 'mongodb';

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'pg_dissertation_db';

async function checkTestUser2() {
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const db = client.db(dbName);

    console.log('🔍 Checking test user testuser2@university.edu...');

    // Check in pending_users collection
    const pendingUser = await db.collection('pending_users').findOne({ email: 'testuser2@university.edu' });
    if (pendingUser) {
      console.log('⏳ User found in pending_users collection:');
      console.log('Email:', pendingUser.email);
      console.log('Full Name:', pendingUser.full_name);
      console.log('Status:', pendingUser.status);
      console.log('Requested Role:', pendingUser.requested_role);
      console.log('Password hash exists:', !!pendingUser.password);
      console.log('Password hash length:', pendingUser.password ? pendingUser.password.length : 0);
      console.log('ID:', pendingUser._id.toString());
      return;
    }

    console.log('❌ User not found in pending_users collection');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkTestUser2();
