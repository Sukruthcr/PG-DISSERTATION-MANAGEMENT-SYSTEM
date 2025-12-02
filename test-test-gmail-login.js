import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3001/api';

async function testLogin() {
  try {
    console.log('🔐 Testing login for test@gmail.com with password test123...');

    const response = await fetch(`${API_BASE_URL}/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@gmail.com',
        password: 'test123',
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log('✅ Login successful!');
      console.log('User details:');
      console.log('- Email:', data.user.email);
      console.log('- Full Name:', data.user.full_name);
      console.log('- Role:', data.user.role);
    } else {
      console.log('❌ Login failed!');
      console.log('Message:', data.message);
      if (data.requiresApproval) {
        console.log('Requires approval: YES');
      }
      if (data.requiresRegistration) {
        console.log('Requires registration: YES');
      }
    }
  } catch (error) {
    console.error('❌ Error during login test:', error.message);
  }
}

testLogin();
