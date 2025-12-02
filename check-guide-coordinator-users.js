import { MongoClient } from 'mongodb';

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'pg_dissertation_db';

async function checkGuideAndCoordinatorUsers() {
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const db = client.db(dbName);

    console.log('🔍 Checking guide and coordinator users...\n');

    // Check all users with guide role
    console.log('📋 GUIDE USERS:');
    const guides = await db.collection('users').find({ role: 'guide' }).toArray();
    
    if (guides.length === 0) {
      console.log('❌ No guide users found');
    } else {
      guides.forEach((guide, index) => {
        console.log(`${index + 1}. Email: ${guide.email}`);
        console.log(`   Name: ${guide.full_name}`);
        console.log(`   Role: ${guide.role}`);
        console.log(`   Department: ${guide.department || 'Not set'}`);
        console.log(`   Specialization: ${guide.specialization || 'Not set'}`);
        console.log(`   Password hash exists: ${!!guide.password}`);
        console.log(`   Password hash length: ${guide.password ? guide.password.length : 0}`);
        console.log('');
      });
    }

    // Check all users with coordinator role
    console.log('📋 COORDINATOR USERS:');
    const coordinators = await db.collection('users').find({ role: 'coordinator' }).toArray();
    
    if (coordinators.length === 0) {
      console.log('❌ No coordinator users found');
    } else {
      coordinators.forEach((coordinator, index) => {
        console.log(`${index + 1}. Email: ${coordinator.email}`);
        console.log(`   Name: ${coordinator.full_name}`);
        console.log(`   Role: ${coordinator.role}`);
        console.log(`   Department: ${coordinator.department || 'Not set'}`);
        console.log(`   Specialization: ${coordinator.specialization || 'Not set'}`);
        console.log(`   Password hash exists: ${!!coordinator.password}`);
        console.log(`   Password hash length: ${coordinator.password ? coordinator.password.length : 0}`);
        console.log('');
      });
    }

    // Check all users to see what's available
    console.log('📋 ALL USERS IN DATABASE:');
    const allUsers = await db.collection('users').find({}).toArray();
    
    if (allUsers.length === 0) {
      console.log('❌ No users found in database');
    } else {
      allUsers.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}`);
        console.log(`   Name: ${user.full_name}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Password hash exists: ${!!user.password}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkGuideAndCoordinatorUsers();

