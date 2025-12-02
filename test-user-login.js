import fetch from 'node-fetch';

async function testGuideLogin() {
  try {
    const response = await fetch('http://localhost:3001/api/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    body: JSON.stringify({
      email: 'guide@university.edu',
      password: 'XyZ9GuideSecureP@ss2024!'
    }),
    });

    const data = await response.json();
    console.log('Response:', data);

    if (data.success) {
      console.log('✅ Guide login successful!');
      console.log('User role:', data.user.role);
    } else {
      console.log('❌ Guide login failed:', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testGuideLogin();
