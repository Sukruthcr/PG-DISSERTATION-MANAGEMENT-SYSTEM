import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'pg_dissertation_db';

async function testGuideCoordinatorLogin() {
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const db = client.db(dbName);

    console.log('🔐 Testing guide and coordinator login credentials...\n');

    // Test credentials
    const testCredentials = [
      {
        email: 'guide@university.edu',
        password: 'guide123',
        role: 'guide',
        name: 'Senior Guide'
      },
      {
        email: 'coordinator@university.edu', 
        password: 'coordinator123',
        role: 'coordinator',
        name: 'Department Coordinator'
      },
      {
        email: 'mohan@presidencyuniversity.in',
        password: 'mohan123',
        role: 'guide',
        name: 'Mohan'
      }
    ];

    for (const cred of testCredentials) {
      console.log(`🔍 Testing login for: ${cred.email}`);
      
      const user = await db.collection('users').findOne({ email: cred.email });
      
      if (!user) {
        console.log(`❌ User not found: ${cred.email}`);
        continue;
      }

      console.log(`✅ User found: ${user.full_name} (${user.role})`);
      
      if (!user.password) {
        console.log(`❌ No password set for ${cred.email}`);
        continue;
      }

      // Test password
      const passwordMatch = await bcrypt.compare(cred.password, user.password);
      
      if (passwordMatch) {
        console.log(`✅ Password correct for ${cred.email}`);
        console.log(`   Login credentials: ${cred.email} / ${cred.password}`);
      } else {
        console.log(`❌ Password incorrect for ${cred.email}`);
        console.log(`   Tried password: ${cred.password}`);
      }
      
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

testGuideCoordinatorLogin();










