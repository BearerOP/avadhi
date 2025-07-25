// Demo data service to simulate API responses
// In a real application, this would be replaced with actual API calls

export interface LogEntry {
  interval_start: string;
  avg_response_time_ms: number;
  ping_count: number;
  is_up: boolean;
}

export interface Website {
  id: string;
  name: string;
  url: string;
  status: 'UP' | 'DOWN' | 'UNKNOWN';
  lastChecked: string;
}

// Generate demo log data for the last hour with 5-minute intervals
export function generateDemoLogs(websiteId: string): LogEntry[] {
  const logs: LogEntry[] = [];
  const now = new Date();
  
  // Generate 12 entries (1 hour of 5-minute intervals)
  for (let i = 0; i < 12; i++) {
    const intervalStart = new Date(now.getTime() - (i * 5 * 60 * 1000));
    
    // Create realistic response times and ping counts
    const baseResponseTime = 150 + Math.random() * 200; // 150-350ms
    const pingCount = 2 + Math.floor(Math.random() * 4); // 2-5 pings
    const isUp = Math.random() > 0.1; // 90% uptime
    
    logs.push({
      interval_start: intervalStart.toISOString(),
      avg_response_time_ms: Math.round(baseResponseTime),
      ping_count: pingCount,
      is_up: isUp
    });
  }
  
  return logs.reverse(); // Most recent first
}

// Demo websites data
export const demoWebsites: Website[] = [
  {
    id: '1',
    name: 'Example Website',
    url: 'https://example.com',
    status: 'UP',
    lastChecked: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Demo Site',
    url: 'https://demo.example.com',
    status: 'DOWN',
    lastChecked: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    name: 'Test Blog',
    url: 'https://blog.example.com',
    status: 'UP',
    lastChecked: new Date(Date.now() - 2 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    name: 'API Server',
    url: 'https://api.example.com',
    status: 'UNKNOWN',
    lastChecked: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  }
];

// Simulate API delay
export function simulateApiDelay(ms: number = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Mock API functions
export async function fetchWebsiteLogs(websiteId: string, after?: string): Promise<LogEntry[]> {
  await simulateApiDelay();
  
  // Filter logs based on 'after' parameter
  const allLogs = generateDemoLogs(websiteId);
  
  if (after) {
    const afterDate = new Date(after);
    return allLogs.filter(log => new Date(log.interval_start) > afterDate);
  }
  
  return allLogs;
}

export async function fetchWebsites(): Promise<Website[]> {
  await simulateApiDelay();
  return demoWebsites;
}

export async function fetchWebsite(websiteId: string): Promise<Website | null> {
  await simulateApiDelay();
  return demoWebsites.find(w => w.id === websiteId) || null;
}

// Generate website statistics
export function generateWebsiteStats(websiteId: string) {
  const logs = generateDemoLogs(websiteId);
  
  const totalPings = logs.reduce((sum, log) => sum + log.ping_count, 0);
  const avgResponseTime = Math.round(
    logs.reduce((sum, log) => sum + log.avg_response_time_ms, 0) / logs.length
  );
  const uptimePercentage = (logs.filter(log => log.is_up).length / logs.length) * 100;
  const lastCheck = logs[logs.length - 1]?.interval_start;
  
  return {
    totalPings,
    avgResponseTime,
    uptimePercentage: Math.round(uptimePercentage * 10) / 10, // Round to 1 decimal
    lastCheck
  };
} 