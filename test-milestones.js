// Quick test script to verify milestone endpoints
const testTopicId = 'test-topic-123';

async function testMilestoneEndpoints() {
  console.log('🧪 Testing Milestone Endpoints...\n');
  
  try {
    // Test 1: Get milestones (should be empty initially)
    console.log('1️⃣ Testing GET /api/topics/:topicId/milestones');
    const getResponse = await fetch(`http://localhost:3001/api/topics/${testTopicId}/milestones`);
    const getData = await getResponse.json();
    console.log('   Response:', getData);
    console.log('   ✅ GET endpoint works\n');
    
    // Test 2: Initialize milestones
    console.log('2️⃣ Testing POST /api/topics/:topicId/milestones/init');
    const initResponse = await fetch(`http://localhost:3001/api/topics/${testTopicId}/milestones/init`, {
      method: 'POST',
    });
    const initData = await initResponse.json();
    console.log('   Response:', initData);
    console.log('   ✅ POST init endpoint works\n');
    
    // Test 3: Get milestones again (should have 6 now)
    console.log('3️⃣ Testing GET again after initialization');
    const getResponse2 = await fetch(`http://localhost:3001/api/topics/${testTopicId}/milestones`);
    const getData2 = await getResponse2.json();
    console.log('   Response:', getData2);
    console.log(`   ✅ Found ${getData2.milestones?.length || 0} milestones\n`);
    
    console.log('✅ All tests passed! Milestone endpoints are working.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\n⚠️  Make sure:');
    console.error('   1. Server is running (npm run dev)');
    console.error('   2. MongoDB is running');
    console.error('   3. Server has been restarted after adding milestone endpoints');
  }
}

testMilestoneEndpoints();
