const axios = require('axios');

async function approveRedUser() {
  try {
    // First get the pending user ID
    const pendingResponse = await axios.get('http://localhost:3001/api/pending-users');
    const pendingUsers = pendingResponse.data.pendingUsers;

    const redUser = pendingUsers.find(user => user.email === 'red@gmail.com');
    if (!redUser) {
      console.log('❌ User red@gmail.com not found in pending users');
      console.log('Available pending users:', pendingUsers.map(u => u.email));
      return;
    }

    console.log('🔍 Found pending user:', redUser.email, 'ID:', redUser.id);

    // Approve the user
    const approveResponse = await axios.post('http://localhost:3001/api/approve-pending-user', {
      pendingUserId: redUser.id,
      approvedBy: 'System Test'
    });

    if (approveResponse.data.success) {
      console.log('✅ User approved successfully!');
      console.log('User details:', approveResponse.data.user);
    } else {
      console.log('❌ Approval failed:', approveResponse.data.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

approveRedUser();
