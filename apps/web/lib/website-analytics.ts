import { client } from "store/client"
import { apiClient } from "./api-client"

export enum WebsiteTickStatus {
  UP = "UP",
  DOWN = "DOWN",
  UNKNOWN = "UNKNOWN",
}

// Real database integration functions
export async function getWebsiteById(id: string): Promise<WebsiteWithTicks | null> {
  try {
    const website = await client.website.findUnique({
      where: { id },
    })
    return website as WebsiteWithTicks | null
  } catch (error) {
    console.error("Error fetching website:", error)
    return null
  }
}

export async function getWebsitesByUserId(userId: string): Promise<WebsiteWithTicks[]> {
  try {
    const websites = await client.website.findMany({
      where: { user_id: userId },
      orderBy: { createdAt: "desc" },
    })
    return websites as WebsiteWithTicks[]
  } catch (error) {
    console.error("Error fetching websites:", error)
    return []
  }
}

export async function getWebsiteTicks(websiteId: string, limit = 50, hours = 24): Promise<WebsiteTickData[]> {
  try {
    console.log(websiteId,'websiteId');
    
    const ticks = await client.websiteTick.findMany({
      where: {
        website_id: websiteId,
      },
      include: {
        Region: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    console.log(ticks,'ticks')

    return ticks as WebsiteTickData[]
  } catch (error) {
    console.error("Error fetching website ticks:", error)
    return []
  }
}

export async function calculateWebsiteInsights(websiteId: string): Promise<WebsiteInsights> {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    // Get all ticks for the last 30 days
    const ticks = await client.websiteTick.findMany({
      where: {
        website_id: websiteId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      include: {
        Region: true,
      },
      orderBy: { createdAt: "desc" },
    })

    if (ticks.length === 0) {
      return {
        uptime: 0,
        avgResponseTime: 0,
        totalChecks: 0,
        lastCheck: null,
        downtimeEvents: 0,
        longestDowntime: "0 minutes",
        fastestResponse: 0,
        slowestResponse: 0,
        regionStats: [],
      }
    }

    // Calculate uptime
    const upTicks = ticks.filter((tick: WebsiteTickData) => tick.status === WebsiteTickStatus.UP)
    const uptime = (upTicks.length / ticks.length) * 100

    // Calculate average response time (only for successful requests)
    const successfulTicks = ticks.filter((tick: WebsiteTickData) => tick.status === WebsiteTickStatus.UP)
    const avgResponseTime =
      successfulTicks.length > 0
        ? successfulTicks.reduce((sum: number, tick: WebsiteTickData) => sum + tick.response_time_ms, 0) / successfulTicks.length
        : 0

    // Find fastest and slowest response times
    const responseTimes = successfulTicks.map((tick: WebsiteTickData) => tick.response_time_ms)
    const fastestResponse = responseTimes.length > 0 ? Math.min(...responseTimes) : 0
    const slowestResponse = responseTimes.length > 0 ? Math.max(...responseTimes) : 0

    // Calculate downtime events
    let downtimeEvents = 0
    let longestDowntimeMs = 0
    let currentDowntimeStart: Date | null = null

    // Sort ticks chronologically for downtime calculation
    const sortedTicks = [...ticks].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

    for (const tick of sortedTicks) {
      if (tick.status === WebsiteTickStatus.DOWN) {
        if (!currentDowntimeStart) {
          currentDowntimeStart = tick.createdAt
          downtimeEvents++
        }
      } else if (currentDowntimeStart) {
        const downtimeDuration = tick.createdAt.getTime() - currentDowntimeStart.getTime()
        longestDowntimeMs = Math.max(longestDowntimeMs, downtimeDuration)
        currentDowntimeStart = null
      }
    }

    // Convert longest downtime to readable format
    const longestDowntimeMinutes = Math.floor(longestDowntimeMs / (1000 * 60))
    const longestDowntime = longestDowntimeMinutes > 0 ? `${longestDowntimeMinutes} minutes` : "0 minutes"

    // Calculate region-specific stats
    const regionMap = new Map<string, WebsiteTickData[]>()
    ticks.forEach((tick: WebsiteTickData) => {
      const regionName = tick.Region.name
      if (!regionMap.has(regionName)) {
        regionMap.set(regionName, [])
      }
      regionMap.get(regionName)!.push(tick)
    })

    const regionStats = Array.from(regionMap.entries()).map(([region, regionTicks]) => {
      const regionUpTicks = regionTicks.filter((tick: WebsiteTickData) => tick.status === WebsiteTickStatus.UP)
      const regionUptime = (regionUpTicks.length / regionTicks.length) * 100
      const regionAvgResponseTime =
        regionUpTicks.length > 0
          ? regionUpTicks.reduce((sum: number, tick: WebsiteTickData) => sum + tick.response_time_ms, 0) / regionUpTicks.length
          : 0
      const lastCheck = regionTicks.length > 0 && regionTicks[0] ? regionTicks[0].createdAt : null

      return {
        region,
        uptime: regionUptime,
        avgResponseTime: Math.round(regionAvgResponseTime),
        lastCheck,
      }
    })

    return {
      uptime: Math.round(uptime * 100) / 100,
      avgResponseTime: Math.round(avgResponseTime),
      totalChecks: ticks.length,
      lastCheck: ticks.length > 0 ? ticks[0].createdAt : null,
      downtimeEvents,
      longestDowntime,
      fastestResponse,
      slowestResponse,
      regionStats,
    }
  } catch (error) {
    console.error("Error calculating website insights:", error)
    return {
      uptime: 0,
      avgResponseTime: 0,
      totalChecks: 0,
      lastCheck: null,
      downtimeEvents: 0,
      longestDowntime: "0 minutes",
      fastestResponse: 0,
      slowestResponse: 0,
      regionStats: [],
    }
  }
}

export async function getLatestWebsiteStatus(websiteId: string): Promise<WebsiteTickStatus> {
  try {
    const res = await apiClient.getWebsiteTicks(websiteId, 50, 24 * 7)
    const latest = (res.data && (res.data as any[])[0]) || null
    return (latest?.status as WebsiteTickStatus) || WebsiteTickStatus.UNKNOWN
  } catch (error) {
    console.error("Error fetching latest website status:", error)
    return WebsiteTickStatus.UNKNOWN
  }
}

// Get all websites with their current status and insights for a user  
export async function getWebsiteOverviewData(userId: string): Promise<WebsiteOverviewData[]> {
  try {
    const websites = await getWebsitesByUserId(userId)
    
    if (websites.length === 0) {
      return []
    }
    
    const websiteOverviews = await Promise.all(
      websites.map(async (website) => {
        const [currentStatus, insights] = await Promise.all([
          getLatestWebsiteStatus(website.id),
          calculateWebsiteInsights(website.id)
        ])

        return {
          ...website,
          currentStatus,
          insights,
        }
      })
    )

    return websiteOverviews
  } catch (error) {
    console.error("Error fetching website overview data:", error)
    return []
  }
}

// Real database integration with fallback demo data

export interface WebsiteWithTicks {
  id: string
  name: string
  url: string
  createdAt: Date
  updatedAt: Date
  user_id: string | null
}

export interface WebsiteTickData {
  id: string
  response_time_ms: number
  status: WebsiteTickStatus
  status_code: number
  status_text: string
  error_message: string | null
  website_id: string
  region_id: string
  createdAt: Date
  updatedAt: Date
  Region: {
    id: string
    name: string
  }
}

export interface WebsiteInsights {
  uptime: number
  avgResponseTime: number
  totalChecks: number
  lastCheck: Date | null
  downtimeEvents: number
  longestDowntime: string
  fastestResponse: number
  slowestResponse: number
  regionStats: Array<{
    region: string
    uptime: number
    avgResponseTime: number
    lastCheck: Date | null
  }>
}

// NEW: Interface for combined overview data
export interface WebsiteOverviewData extends WebsiteWithTicks {
  currentStatus: WebsiteTickStatus
  insights: WebsiteInsights
}

// Demo websites data
const demoWebsites: WebsiteWithTicks[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Google",
    url: "https://google.com",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    user_id: "user-demo-1",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "GitHub",
    url: "https://github.com",
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    user_id: "user-demo-1",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Stack Overflow",
    url: "https://stackoverflow.com",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    updatedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    user_id: "user-demo-1",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "Vercel",
    url: "https://vercel.com",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    updatedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    user_id: "user-demo-1",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    updatedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    user_id: "user-demo-1",
  },
]

// Demo regions
const demoRegions = [
  { id: "region-us-east-1", name: "US East (N. Virginia)" },
  { id: "region-us-west-2", name: "US West (Oregon)" },
  { id: "region-eu-west-1", name: "Europe (Ireland)" },
  { id: "region-ap-southeast-1", name: "Asia Pacific (Singapore)" },
]

// Demo data generators
export function getDemoWebsiteById(id: string): WebsiteWithTicks | null {
  return demoWebsites.find((website) => website.id === id) || null
}

export function getAllDemoWebsites(): WebsiteWithTicks[] {
  return demoWebsites
}

// Create a deterministic seed from website ID to prevent infinite re-renders
function getDeterministicSeed(websiteId: string, index: number): number {
  let hash = 0;
  const str = websiteId + index.toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash % 10000) / 10000; // Normalize to 0-1
}

export function generateDemoTicks(websiteId: string, limit = 50): WebsiteTickData[] {
  const website = getDemoWebsiteById(websiteId)
  if (!website) return []

  const ticks: WebsiteTickData[] = []
  const now = new Date()

  // Create realistic demo patterns based on website
  const demoPatterns = {
    "550e8400-e29b-41d4-a716-446655440001": {
      // Google - very reliable
      errorRate: 0.02,
      avgResponse: 120,
      statusChanges: 0.01,
    },
    "550e8400-e29b-41d4-a716-446655440002": {
      // GitHub - reliable
      errorRate: 0.05,
      avgResponse: 280,
      statusChanges: 0.03,
    },
    "550e8400-e29b-41d4-a716-446655440003": {
      // Stack Overflow - some issues
      errorRate: 0.15,
      avgResponse: 450,
      statusChanges: 0.12,
    },
    "550e8400-e29b-41d4-a716-446655440004": {
      // Vercel - reliable
      errorRate: 0.03,
      avgResponse: 200,
      statusChanges: 0.02,
    },
    "550e8400-e29b-41d4-a716-446655440005": {
      // MDN - stable
      errorRate: 0.08,
      avgResponse: 350,
      statusChanges: 0.05,
    },
  }

  const pattern = demoPatterns[websiteId as keyof typeof demoPatterns] || {
    errorRate: 0.1,
    avgResponse: 400,
    statusChanges: 0.08,
  }

  for (let i = 0; i < limit; i++) {
    const timestamp = new Date(now.getTime() - i * 15 * 60 * 1000) // 15 minutes apart
    const rand = getDeterministicSeed(websiteId, i) // Use deterministic seed
    const regionIndex = Math.floor(rand * demoRegions.length)
    const region = demoRegions[regionIndex] || demoRegions[0]

    let status: WebsiteTickStatus
    let statusCode: number
    let statusText: string
    let errorMessage: string | null = null
    let responseTime: number

    if (rand < pattern.errorRate) {
      status = WebsiteTickStatus.DOWN
      const statusCodes = [500, 502, 503, 504, 404]
      const statusCodeIndex = Math.floor(getDeterministicSeed(websiteId, i + 1000) * statusCodes.length)
      statusCode = statusCodes[statusCodeIndex] || 500
      statusText =
        {
          500: "Internal Server Error",
          502: "Bad Gateway",
          503: "Service Unavailable",
          504: "Gateway Timeout",
          404: "Not Found",
        }[statusCode] || "Error"
      const errorMessages = [
        "Connection timeout",
        "DNS resolution failed",
        "SSL certificate error",
        "Server unreachable",
        "Rate limit exceeded",
      ]
      const errorIndex = Math.floor(getDeterministicSeed(websiteId, i + 2000) * errorMessages.length)
      errorMessage = errorMessages[errorIndex] || "Connection error"
      responseTime = Math.floor(getDeterministicSeed(websiteId, i + 3000) * 5000) + 5000 // 5-10 seconds for errors
    } else if (rand < pattern.errorRate + 0.02) {
      status = WebsiteTickStatus.UNKNOWN
      statusCode = 0
      statusText = "Unknown"
      errorMessage = "Unable to determine status"
      responseTime = 0
    } else {
      status = WebsiteTickStatus.UP
      statusCode = 200
      statusText = "OK"
      responseTime = Math.floor(getDeterministicSeed(websiteId, i + 4000) * 400) + pattern.avgResponse - 200
      responseTime = Math.max(50, responseTime) // Minimum 50ms
    }

    ticks.push({
      id: `tick-${websiteId}-${i}`,
      response_time_ms: responseTime,
      status,
      status_code: statusCode,
      status_text: statusText,
      error_message: errorMessage,
      website_id: websiteId,
      region_id: region?.id || "region-us-east-1",
      createdAt: timestamp,
      updatedAt: timestamp,
      Region: region || { id: "region-us-east-1", name: "US East (N. Virginia)" },
    })
  }

  return ticks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export function calculateDemoInsights(websiteId: string): WebsiteInsights {
  const ticks = generateDemoTicks(websiteId, 200) // 30 days of data

  if (ticks.length === 0) {
    return {
      uptime: 0,
      avgResponseTime: 0,
      totalChecks: 0,
      lastCheck: null,
      downtimeEvents: 0,
      longestDowntime: "0 minutes",
      fastestResponse: 0,
      slowestResponse: 0,
      regionStats: [],
    }
  }

  // Calculate uptime
  const upTicks = ticks.filter((tick) => tick.status === WebsiteTickStatus.UP)
  const uptime = (upTicks.length / ticks.length) * 100

  // Calculate average response time (only for successful requests)
  const successfulTicks = ticks.filter((tick) => tick.status === WebsiteTickStatus.UP)
  const avgResponseTime =
    successfulTicks.length > 0
      ? successfulTicks.reduce((sum, tick) => sum + tick.response_time_ms, 0) / successfulTicks.length
      : 0

  // Find fastest and slowest response times
  const responseTimes = successfulTicks.map((tick) => tick.response_time_ms)
  const fastestResponse = responseTimes.length > 0 ? Math.min(...responseTimes) : 0
  const slowestResponse = responseTimes.length > 0 ? Math.max(...responseTimes) : 0

  // Calculate downtime events
  let downtimeEvents = 0
  let longestDowntimeMs = 0
  let currentDowntimeStart: Date | null = null

  // Sort ticks chronologically for downtime calculation
  const sortedTicks = [...ticks].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  for (const tick of sortedTicks) {
    if (tick.status === WebsiteTickStatus.DOWN) {
      if (!currentDowntimeStart) {
        currentDowntimeStart = tick.createdAt
        downtimeEvents++
      }
    } else if (currentDowntimeStart) {
      const downtimeDuration = tick.createdAt.getTime() - currentDowntimeStart.getTime()
      longestDowntimeMs = Math.max(longestDowntimeMs, downtimeDuration)
      currentDowntimeStart = null
    }
  }

  // Convert longest downtime to readable format
  const longestDowntimeMinutes = Math.floor(longestDowntimeMs / (1000 * 60))
  const longestDowntime = longestDowntimeMinutes > 0 ? `${longestDowntimeMinutes} minutes` : "0 minutes"

  // Calculate region-specific stats
  const regionMap = new Map<string, WebsiteTickData[]>()
  ticks.forEach((tick) => {
    const regionName = tick.Region.name
    if (!regionMap.has(regionName)) {
      regionMap.set(regionName, [])
    }
    regionMap.get(regionName)!.push(tick)
  })

  const regionStats = Array.from(regionMap.entries()).map(([region, regionTicks]) => {
    const regionUpTicks = regionTicks.filter((tick) => tick.status === WebsiteTickStatus.UP)
    const regionUptime = (regionUpTicks.length / regionTicks.length) * 100
    const regionAvgResponseTime =
      regionUpTicks.length > 0
        ? regionUpTicks.reduce((sum, tick) => sum + tick.response_time_ms, 0) / regionUpTicks.length
        : 0
    const lastCheck = regionTicks.length > 0 && regionTicks[0] ? regionTicks[0].createdAt : null

    return {
      region,
      uptime: regionUptime,
      avgResponseTime: Math.round(regionAvgResponseTime),
      lastCheck,
    }
  })

  return {
    uptime: Math.round(uptime * 100) / 100,
    avgResponseTime: Math.round(avgResponseTime),
    totalChecks: ticks.length,
    lastCheck: ticks.length > 0 && ticks[0] ? ticks[0].createdAt : null,
    downtimeEvents,
    longestDowntime,
    fastestResponse,
    slowestResponse,
    regionStats,
  }
}

export function getDemoLatestWebsiteStatus(websiteId: string): WebsiteTickStatus {
  // Use deterministic seed for consistent status
  const seed = getDeterministicSeed(websiteId, 0)
  
  // 85% chance of UP, 10% DOWN, 5% UNKNOWN
  if (seed < 0.85) return WebsiteTickStatus.UP
  if (seed < 0.95) return WebsiteTickStatus.DOWN
  return WebsiteTickStatus.UNKNOWN
}

// NEW: Function to get all websites with their current status and insights
export function getAllDemoWebsiteOverviewData(): WebsiteOverviewData[] {
  return demoWebsites.map((website) => ({
    ...website,
    currentStatus: getDemoLatestWebsiteStatus(website.id),
    insights: calculateDemoInsights(website.id),
  }))
}

