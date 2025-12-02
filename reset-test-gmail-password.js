import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'pg_dissertation_db';
const saltRounds = 10;

async function resetTestGmailPassword() {
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const db = client.db(dbName);

    console.log('🔧 Resetting password for test@gmail.com to test123...');

    // Hash the new password
    const newPassword = 'test123';
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user
    const result = await db.collection('users').updateOne(
      { email: 'test@gmail.com' },
      {
        $set: {
          password: hashedPassword,
          updated_at: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      console.log('❌ User not found');
      return;
    }

    console.log('✅ Password reset successfully!');
    console.log('New password: test123');

  } catch (error) {
    console.error('❌ Error resetting password:', error);
  } finally {
    await client.close();
  }
}

resetTestGmailPassword();
