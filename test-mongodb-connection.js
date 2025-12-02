import { mongoDb } from './src/services/mongoService.ts';

async function testMongoDBConnection() {
  try {
    console.log('Testing MongoDB connection...');
    await mongoDb.connect();

    console.log('✅ MongoDB connection successful!');

    // Test getting users collection
    const usersCollection = mongoDb.getCollection('users');
    const userCount = await usersCollection.countDocuments();
    console.log(`✅ Found ${userCount} users in database`);

    // Test getting pending users collection
    const pendingUsersCollection = mongoDb.getCollection('pending_users');
    const pendingUserCount = await pendingUsersCollection.countDocuments();
    console.log(`✅ Found ${pendingUserCount} pending users in database`);

    console.log('✅ All MongoDB tests passed!');

  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error);
  } finally {
    await mongoDb.disconnect();
  }
}

