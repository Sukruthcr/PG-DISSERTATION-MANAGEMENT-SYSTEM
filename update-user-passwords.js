import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'pg_dissertation_db';
const saltRounds = 10;

async function updateUserPasswords() {
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const db = client.db(dbName);

    console.log('🔧 Updating user passwords...');

    // Update Senior Guide password
    const guidePassword = await bcrypt.hash('guide123', saltRounds);
    const guideResult = await db.collection('users').updateOne(
      { full_name: 'Senior Guide', role: 'guide' },
      { $set: { password: guidePassword } }
    );

    if (guideResult.modifiedCount > 0) {
      console.log('✅ Senior Guide password updated to: guide123');
    } else {
      console.log('⚠️ Senior Guide password not updated (user not found or already has this password)');
    }

    // Update Department Coordinator password
    const coordinatorPassword = await bcrypt.hash('coordinator123', saltRounds);
    const coordinatorResult = await db.collection('users').updateOne(
      { full_name: 'Department Coordinator', role: 'coordinator' },
      { $set: { password: coordinatorPassword } }
    );

    if (coordinatorResult.modifiedCount > 0) {
      console.log('✅ Department Coordinator password updated to: coordinator123');
    } else {
      console.log('⚠️ Department Coordinator password not updated (user not found or already has this password)');
    }

    console.log('🔧 Password update completed!');

  } catch (error) {
    console.error('❌ Error updating passwords:', error);
  } finally {
    await client.close();
  }
}

updateUserPasswords();
