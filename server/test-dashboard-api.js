import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api/dashboard';

// Test function to verify dashboard API endpoints
async function testDashboardAPI() {
  console.log('🧪 Testing Dashboard API endpoints...\n');

  try {
    // Test health check first
    console.log('1. Testing health check...');
    const healthResponse = await fetch('http://localhost:5000/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.status);

    // Test dashboard stats endpoint (without auth - should fail)
    console.log('\n2. Testing dashboard stats without auth...');
    try {
      const statsResponse = await fetch(`${API_BASE}/stats`);
      const statsData = await statsResponse.json();
      console.log('❌ Stats without auth should fail:', statsData);
    } catch (error) {
      console.log('✅ Stats without auth correctly failed:', error.message);
    }

    // Test dashboard overview endpoint (without auth - should fail)
    console.log('\n3. Testing dashboard overview without auth...');
    try {
      const overviewResponse = await fetch(`${API_BASE}/overview`);
      const overviewData = await overviewResponse.json();
      console.log('❌ Overview without auth should fail:', overviewData);
    } catch (error) {
      console.log('✅ Overview without auth correctly failed:', error.message);
    }

    console.log('\n🎉 Dashboard API tests completed!');
    console.log('\n📝 Note: To test with authentication, you need to:');
    console.log('   1. Start the server: npm run dev');
    console.log('   2. Login through the frontend to get a valid token');
    console.log('   3. Use the token in Authorization header');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testDashboardAPI();
}

export default testDashboardAPI;
