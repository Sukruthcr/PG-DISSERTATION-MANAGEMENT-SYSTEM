import fetch from 'node-fetch';

async function testAdminLogin() {
  try {
    const response = await fetch('http://localhost:3001/api/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@university.edu',
        password: 'admin123'
      }),
    });

    const data = await response.json();
    console.log('Response:', data);

    if (data.success) {
      console.log('✅ Admin login successful!');
      console.log('User role:', data.user.role);
    } else {
      console.log('❌ Admin login failed:', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testAdminLogin();
