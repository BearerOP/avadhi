"use client"

import prisma from "store/client"
import { WebsiteTickStatus } from "./website-analytics"
import { WebsiteWithTicks, WebsiteTickData, WebsiteInsights, WebsiteOverviewData } from "./website-analytics"

// Real database functions for production use
export async function getRealWebsitesByUserId(userId: string): Promise<WebsiteWithTicks[]> {
  try {
    const websites = await prisma.website.findMany({
      where: { user_id: userId },
      orderBy: { createdAt: "desc" },
    })
    return websites
  } catch (error) {
    console.error("Error fetching real websites:", error)
    return []
  }
}

export async function getRealWebsiteById(id: string): Promise<WebsiteWithTicks | null> {
  try {
    const website = await prisma.website.findUnique({
      where: { id },
    })
    return website
  } catch (error) {
    console.error("Error fetching real website:", error)
    return null
  }
}

export async function getRealWebsiteTicks(websiteId: string, limit = 50, hours = 24): Promise<WebsiteTickData[]> {
  try {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000)

    const ticks = await prisma.websiteTick.findMany({
      where: {
        website_id: websiteId,
        createdAt: {
          gte: since,
        },
      },
      include: {
        Region: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    return ticks
  } catch (error) {
    console.error("Error fetching real website ticks:", error)
    return []
  }
}

export async function calculateRealWebsiteInsights(websiteId: string): Promise<WebsiteInsights> {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    // Get all ticks for the last 30 days
    const ticks = await prisma.websiteTick.findMany({
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
  } catch (error) {
    console.error("Error calculating real website insights:", error)
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

export async function getRealLatestWebsiteStatus(websiteId: string): Promise<WebsiteTickStatus> {
  try {
    const latestTick = await prisma.websiteTick.findFirst({
      where: { website_id: websiteId },
      orderBy: { createdAt: "desc" },
    })

    return latestTick?.status || WebsiteTickStatus.UNKNOWN
  } catch (error) {
    console.error("Error fetching real latest website status:", error)
    return WebsiteTickStatus.UNKNOWN
  }
}

// Get all websites with their current status and insights for a user
export async function getRealWebsiteOverviewData(userId: string): Promise<WebsiteOverviewData[]> {
  try {
    const websites = await getRealWebsitesByUserId(userId)
    
    const websiteOverviews = await Promise.all(
      websites.map(async (website) => {
        const [currentStatus, insights] = await Promise.all([
          getRealLatestWebsiteStatus(website.id),
          calculateRealWebsiteInsights(website.id)
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
    console.error("Error fetching real website overview data:", error)
    return []
  }
}