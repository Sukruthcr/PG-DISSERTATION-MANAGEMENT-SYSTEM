// Simple test script for the registration system
import {
  getUserByEmail,
  getPendingUsers,
  registerPendingUser,
  approvePendingUser,
  authenticateUser
} from './src/services/simpleDatabaseService.ts';

async function testRegistration() {
  console.log('🧪 Testing Registration System...\n');

  // Test 1: Try to authenticate non-existent user
  console.log('1. Testing authentication of non-existent user...');
  const authResult = await authenticateUser('newuser@university.edu', 'password123');
  console.log('Result:', authResult);
  console.log('✅ Should show requiresRegistration: true\n');

  // Test 2: Register new user
  console.log('2. Testing user registration...');
  const registrationData = {
    email: 'newuser@university.edu',
    full_name: 'New Test User',
    department: 'Computer Science',
    specialization: 'Machine Learning',
    phone: '+1-555-0123',
    requested_role: 'student',
    student_id: 'CS2024002'
  };

  const regResult = await registerPendingUser(registrationData);
  console.log('Result:', regResult);
  console.log('✅ Should show success: true\n');

  // Test 3: Check pending users
  console.log('3. Testing pending users list...');
  const pendingUsers = await getPendingUsers();
  console.log('Pending users:', pendingUsers);
  console.log('✅ Should show the new pending user\n');

  // Test 4: Approve user
  console.log('4. Testing user approval...');
  const pendingUserId = pendingUsers[0]?.id;
  if (pendingUserId) {
    const approvalResult = await approvePendingUser(pendingUserId, 'admin@university.edu');
    console.log('Result:', approvalResult);
    console.log('✅ Should show success: true\n');
  }

  // Test 5: Authenticate approved user
  console.log('5. Testing authentication of approved user...');
  const finalAuthResult = await authenticateUser('newuser@university.edu', 'default123');
  console.log('Result:', finalAuthResult);
  console.log('✅ Should show success: true\n');

  console.log('🎉 Registration system test completed!');
}

// Run the test
testRegistration().catch(console.error);
