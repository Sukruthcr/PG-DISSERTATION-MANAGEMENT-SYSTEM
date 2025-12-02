import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'pg_dissertation_db';
const saltRounds = 10;

async function resetPassword() {
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const db = client.db(dbName);

    console.log('🔧 Resetting password for sukruth.20221ise0092@presidencyuniversity.in...');

    const newPassword = 'suchitra';
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const result = await db.collection('users').updateOne(
      { email: 'sukruth.20221ise0092@presidencyuniversity.in' },
      { $set: { password: hashedPassword, updated_at: new Date() } }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Password reset successfully to: suchitra');
    } else {
      console.log('❌ User not found or password already set');
    }

  } catch (error) {
    console.error('❌ Error resetting password:', error);
  } finally {
    await client.close();
  }
}

resetPassword();
