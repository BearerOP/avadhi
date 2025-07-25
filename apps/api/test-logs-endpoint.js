// Test file to demonstrate the new logs endpoint
// Run this with: node test-logs-endpoint.js

const BASE_URL = 'http://localhost:3000/api/v1';

// Example 1: Fetch logs for the last hour (default)
async function fetchLogsLastHour(websiteId, authToken) {
  try {
    const response = await fetch(`${BASE_URL}/website/${websiteId}/logs`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('✅ Last hour logs:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching last hour logs:', error);
  }
}

// Example 2: Fetch logs after a specific timestamp
async function fetchLogsAfterTimestamp(websiteId, authToken, afterTimestamp) {
  try {
    const response = await fetch(`${BASE_URL}/website/${websiteId}/logs?after=${afterTimestamp}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('✅ Logs after timestamp:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching logs after timestamp:', error);
  }
}

// Example 3: Fetch logs for the last 5 minutes (for real-time updates)
async function fetchLogsLast5Minutes(websiteId, authToken) {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const response = await fetch(`${BASE_URL}/website/${websiteId}/logs?after=${fiveMinutesAgo}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('✅ Last 5 minutes logs:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching last 5 minutes logs:', error);
  }
}

// Example usage:
// Replace with actual values
const WEBSITE_ID = 'your-website-id';
const AUTH_TOKEN = 'your-jwt-token';

console.log('🚀 Testing Logs Endpoint\n');

// Test 1: Default behavior (last hour)
fetchLogsLastHour(WEBSITE_ID, AUTH_TOKEN);

// Test 2: Custom timestamp
const customTimestamp = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(); // 2 hours ago
fetchLogsAfterTimestamp(WEBSITE_ID, AUTH_TOKEN, customTimestamp);

// Test 3: Real-time updates (last 5 minutes)
fetchLogsLast5Minutes(WEBSITE_ID, AUTH_TOKEN);

console.log('\n📝 Expected Response Format:');
console.log(`
{
  "message": "Website logs fetched successfully",
  "data": [
    {
      "interval_start": "2025-01-27T12:05:00.000Z",
      "avg_response_time_ms": 240,
      "ping_count": 3,
      "is_up": true
    },
    {
      "interval_start": "2025-01-27T12:00:00.000Z", 
      "avg_response_time_ms": 180,
      "ping_count": 5,
      "is_up": true
    }
  ]
}
`); 