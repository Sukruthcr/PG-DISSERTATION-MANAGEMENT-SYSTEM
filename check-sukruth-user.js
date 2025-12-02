import { MongoClient } from 'mongodb';

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'pg_dissertation_db';

async function checkUser() {
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const db = client.db(dbName);

    console.log('🔍 Checking hem.20221ise0091@presidencyuniversity.in status...');

    // Check in users collection
    const user = await db.collection('users').findOne({ email: 'hem.20221ise0091@presidencyuniversity.in' });
    if (user) {
      console.log('✅ User found in users collection (approved):');
      console.log('Email:', user.email);
      console.log('Full Name:', user.full_name);
      console.log('Role:', user.role);
      console.log('Password hash exists:', !!user.password);
      console.log('Can login: YES');
      return;
    }

    // Check in pending_users collection
    const pendingUser = await db.collection('pending_users').findOne({ email: 'hem.20221ise0091@presidencyuniversity.in' });
    if (pendingUser) {
      console.log('⏳ User found in pending_users collection (pending approval):');
      console.log('Email:', pendingUser.email);
      console.log('Full Name:', pendingUser.full_name);
      console.log('Status:', pendingUser.status);
      console.log('Requested Role:', pendingUser.requested_role);
      console.log('Password hash exists:', !!pendingUser.password);
      console.log('Can login: NO (needs admin approval first)');
      return;
    }

    console.log('❌ User not found in either collection');
    console.log('Can login: NO (user not registered)');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkUser();
