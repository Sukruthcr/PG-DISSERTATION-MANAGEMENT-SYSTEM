/**
 * Server Diagnostic Script
 * Run this to check if the server is configured correctly
 * Usage: node diagnose-server.js
 */

const http = require('http');

const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}`;

console.log('🔍 PG Dissertation System - Server Diagnostics\n');
console.log('═══════════════════════════════════════════════\n');

// Test endpoints
const endpoints = [
  { method: 'GET', path: '/api/users', description: 'Get all users' },
  { method: 'GET', path: '/api/student-projects', description: 'Get all projects' },
  { method: 'GET', path: '/api/students/test123/guide', description: 'Get guide for student (will return null if no assignment)' },
  { method: 'GET', path: '/api/students/test123/coordinator', description: 'Get coordinator for student' },
];

async function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: endpoint.path,
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            success: true,
            status: res.statusCode,
            isJSON: true,
            data: parsed
          });
        } catch (e) {
          resolve({
            success: false,
            status: res.statusCode,
            isJSON: false,
            data: data.substring(0, 100) // First 100 chars
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        success: false,
        error: error.message
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        success: false,
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

async function runDiagnostics() {
  console.log('Testing server connectivity...\n');

  // Test 1: Check if server is running
  console.log('Test 1: Server Connectivity');
  console.log('─────────────────────────────');
  
  const serverTest = await testEndpoint({ method: 'GET', path: '/api/users' });
  
  if (serverTest.error) {
    console.log('❌ Server is NOT running');
    console.log(`   Error: ${serverTest.error}`);
    console.log('\n💡 Solution: Start the server with "npm run dev"\n');
    return;
  }
  
  console.log('✅ Server is running on port', PORT);
  console.log('');

  // Test 2: Check API endpoints
  console.log('Test 2: API Endpoints');
  console.log('─────────────────────────────');
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    
    if (result.error) {
      console.log(`❌ ${endpoint.method} ${endpoint.path}`);
      console.log(`   Error: ${result.error}`);
    } else if (!result.isJSON) {
      console.log(`❌ ${endpoint.method} ${endpoint.path}`);
      console.log(`   Returns HTML instead of JSON (status: ${result.status})`);
      console.log(`   This means the endpoint is not registered correctly`);
      console.log(`   Response preview: ${result.data}...`);
    } else {
      console.log(`✅ ${endpoint.method} ${endpoint.path}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Response: ${JSON.stringify(result.data).substring(0, 80)}...`);
    }
    console.log('');
  }

  // Test 3: Recommendations
  console.log('Test 3: Recommendations');
  console.log('─────────────────────────────');
  
  const hasHTMLResponse = endpoints.some(async (ep) => {
    const result = await testEndpoint(ep);
    return !result.isJSON && !result.error;
  });

  if (hasHTMLResponse) {
    console.log('⚠️  Some endpoints return HTML instead of JSON');
    console.log('');
    console.log('Possible causes:');
    console.log('1. Server needs to be restarted');
    console.log('2. API routes are defined after catch-all route');
    console.log('3. MongoDB connection failed');
    console.log('');
    console.log('Solutions:');
    console.log('1. Stop server (Ctrl+C) and restart: npm run dev');
    console.log('2. Check server.js - API routes must be before line 986');
    console.log('3. Verify MongoDB is running: mongod');
    console.log('');
  } else {
    console.log('✅ All endpoints returning JSON correctly');
    console.log('');
  }

  // Test 4: MongoDB Connection
  console.log('Test 4: Database Check');
  console.log('─────────────────────────────');
  
  const usersTest = await testEndpoint({ method: 'GET', path: '/api/users' });
  
  if (usersTest.isJSON && usersTest.data.success) {
    console.log('✅ MongoDB connection working');
    console.log(`   Found ${usersTest.data.users ? usersTest.data.users.length : 0} users in database`);
  } else {
    console.log('❌ MongoDB connection issue');
    console.log('   Make sure MongoDB is running: mongod');
  }
  console.log('');

  // Summary
  console.log('═══════════════════════════════════════════════');
  console.log('Summary');
  console.log('═══════════════════════════════════════════════');
  console.log('');
  console.log('If you see HTML responses instead of JSON:');
  console.log('1. Restart the server: npm run dev');
  console.log('2. Hard refresh browser: Ctrl+Shift+R');
  console.log('3. Check MongoDB is running');
  console.log('');
  console.log('If guide assignments are not persisting:');
  console.log('1. Verify server has latest code');
  console.log('2. Check database: mongo → use pg_dissertation_db → db.topics.find()');
  console.log('3. Run test script: node test-guide-coordinator-features.js');
  console.log('');
  console.log('For more help, see TROUBLESHOOTING_GUIDE.md');
  console.log('');
}

// Run diagnostics
runDiagnostics().catch(console.error);
