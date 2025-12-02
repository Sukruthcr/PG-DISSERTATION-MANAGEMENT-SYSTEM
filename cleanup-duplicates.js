import { MongoClient } from 'mongodb';

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'pg_dissertation_db';

async function cleanupDuplicates() {
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const db = client.db(dbName);

    console.log('🔍 Checking for duplicate users...');

    // Get all users from both collections
    const users = await db.collection('users').find({}).toArray();
    const pendingUsers = await db.collection('pending_users').find({}).toArray();

    console.log(`📊 Found ${users.length} users in users collection`);
    console.log(`📊 Found ${pendingUsers.length} users in pending_users collection`);

    // Check for duplicates (same email in both collections)
    const duplicates = [];
    const pendingEmails = new Set(pendingUsers.map(p => p.email.toLowerCase()));
    const userEmails = new Set(users.map(u => u.email.toLowerCase()));

    // Find emails that exist in both collections
    for (const user of users) {
      if (pendingEmails.has(user.email.toLowerCase())) {
        duplicates.push({
          email: user.email,
          userId: user._id,
          pendingUser: pendingUsers.find(p => p.email.toLowerCase() === user.email.toLowerCase())
        });
      }
    }

    console.log(`🚨 Found ${duplicates.length} duplicate entries:`);

    for (const duplicate of duplicates) {
      console.log(`  - ${duplicate.email}: User ID ${duplicate.userId}, Pending ID ${duplicate.pendingUser._id}`);

      // Remove the pending user entry since the user is already approved
      const deleteResult = await db.collection('pending_users').deleteOne({ _id: duplicate.pendingUser._id });
      console.log(`  ✅ Removed pending user entry for ${duplicate.email}`);
    }

    // Also check for any pending users with 'approved' status that should have been deleted
    const approvedPendingUsers = await db.collection('pending_users').find({ status: 'approved' }).toArray();
    console.log(`📋 Found ${approvedPendingUsers.length} pending users with 'approved' status that should be cleaned up`);

    for (const approvedUser of approvedPendingUsers) {
      console.log(`  - ${approvedUser.email} (ID: ${approvedUser._id}) - removing...`);
      await db.collection('pending_users').deleteOne({ _id: approvedUser._id });
      console.log(`  ✅ Removed approved pending user: ${approvedUser.email}`);
    }

    console.log('🧹 Cleanup completed!');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await client.close();
  }
}

cleanupDuplicates();
