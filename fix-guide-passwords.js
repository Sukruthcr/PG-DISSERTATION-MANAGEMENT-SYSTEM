import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'pg_dissertation_db';
const saltRounds = 10;

async function fixGuidePasswords() {
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const db = client.db(dbName);

    console.log('🔧 Fixing guide passwords...\n');

    // Fix Senior Guide password
    const guidePassword = await bcrypt.hash('guide123', saltRounds);
    const guideResult = await db.collection('users').updateOne(
      { email: 'guide@university.edu' },
      { $set: { password: guidePassword } }
    );

    if (guideResult.modifiedCount > 0) {
      console.log('✅ Senior Guide password updated');
      console.log('   Email: guide@university.edu');
      console.log('   Password: guide123');
    }

    // Fix Mohan's password
    const mohanPassword = await bcrypt.hash('mohan123', saltRounds);
    const mohanResult = await db.collection('users').updateOne(
      { email: 'mohan@presidencyuniversity.in' },
      { $set: { password: mohanPassword } }
    );

    if (mohanResult.modifiedCount > 0) {
      console.log('✅ Mohan password updated');
      console.log('   Email: mohan@presidencyuniversity.in');
      console.log('   Password: mohan123');
    }

    console.log('\n🎉 All guide passwords fixed!');
    console.log('\n📋 LOGIN CREDENTIALS:');
    console.log('Guide: guide@university.edu / guide123');
    console.log('Coordinator: coordinator@university.edu / coordinator123');
    console.log('Mohan (Guide): mohan@presidencyuniversity.in / mohan123');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

fixGuidePasswords();










