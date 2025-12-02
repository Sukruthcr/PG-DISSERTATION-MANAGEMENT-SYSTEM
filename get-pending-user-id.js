import { MongoClient } from 'mongodb';

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'pg_dissertation_db';

async function getPendingUserId() {
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const db = client.db(dbName);

    const pendingUser = await db.collection('pending_users').findOne({ email: 'testuser@university.edu' });
    if (pendingUser) {
      console.log('Pending user ID:', pendingUser._id.toString());
    } else {
      console.log('Pending user not found');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

getPendingUserId();
