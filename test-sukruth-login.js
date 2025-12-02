import fetch from 'node-fetch';

async function testSukruthLogin() {
  try {
    const response = await fetch('http://localhost:3001/api/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'hem.20221ise0091@presidencyuniversity.in',
        password: 'sukruth@'
      }),
    });

    const data = await response.json();
    console.log('Response:', data);

    if (data.success) {
      console.log('✅ Sukruth login successful!');
      console.log('User role:', data.user.role);
    } else {
      console.log('❌ Sukruth login failed:', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testSukruthLogin();
