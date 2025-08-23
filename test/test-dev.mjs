#!/usr/bin/env node

console.log('🧪 Testing Bedrock Manager Dev Environment...\n');

const BASE_URL = 'http://localhost:3000';

// Simple test functions
async function testEndpoint(name, endpoint, expectedStatus = 200) {
  try {
    console.log(`🔍 Testing ${name}...`);
    const response = await fetch(`${BASE_URL}${endpoint}`);
    
    if (response.status === expectedStatus) {
      console.log(`✅ ${name} - ${response.status}`);
      
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();
        if (Array.isArray(data)) {
          console.log(`   📊 Found ${data.length} items`);
        }
      }
    } else {
      console.log(`❌ ${name} - Expected ${expectedStatus}, got ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ ${name} - Error: ${error.message}`);
  }
}

// Quick health check
async function quickHealthCheck() {
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    if (response.ok) {
      const data = await response.json();
      console.log(`🏥 Health: ${data.status} (${data.version})`);
      return true;
    }
  } catch (error) {
    console.log('🏥 Health: ❌ Service not responding');
    return false;
  }
  return false;
}

// Main test runner
async function runQuickTests() {
  console.log('🚀 Starting quick tests...\n');
  
  // Health check first
  const isHealthy = await quickHealthCheck();
  if (!isHealthy) {
    console.log('\n❌ Service is not healthy. Make sure the dev environment is running:');
    console.log('   npm run dev:start');
    return;
  }
  
  console.log('\n📋 Running API tests...\n');
  
  // Test core endpoints
  await testEndpoint('Health Check', '/api/health');
  await testEndpoint('List Servers', '/api/servers');
  await testEndpoint('List Worlds', '/api/worlds');
  
  console.log('\n🎉 Quick tests complete!');
  console.log('\n💡 You can now:');
  console.log('   - Open http://localhost:3000 in your browser');
  console.log('   - Test the UI manually');
  console.log('   - Run this test anytime: npm run test:dev');
}

// Run tests
runQuickTests().catch(console.error);
