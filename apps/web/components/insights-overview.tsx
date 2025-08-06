"use client"

import { TrendingUp, Clock, Activity, AlertTriangle, Zap, Timer } from "lucide-react"
import type { WebsiteOverviewData } from "../lib/website-analytics"

interface InsightsOverviewProps {
  websites: WebsiteOverviewData[]
}

export default function InsightsOverview({ websites }: InsightsOverviewProps) {
  // Calculate aggregate insights across all websites
  const totalWebsites = websites.length
  const onlineWebsites = websites.filter(w => w.currentStatus === "UP").length
  const offlineWebsites = websites.filter(w => w.currentStatus === "DOWN").length
  
  // Average uptime across all websites
  const avgUptime = totalWebsites > 0 
    ? websites.reduce((sum, w) => sum + w.insights.uptime, 0) / totalWebsites 
    : 0

  // Average response time across all websites  
  const avgResponseTime = totalWebsites > 0
    ? websites.reduce((sum, w) => sum + w.insights.avgResponseTime, 0) / totalWebsites
    : 0

  // Total downtime events
  const totalDowntimeEvents = websites.reduce((sum, w) => sum + w.insights.downtimeEvents, 0)

  // Find fastest overall response
  const fastestResponse = websites.length > 0 
    ? Math.min(...websites.map(w => w.insights.fastestResponse).filter(r => r > 0))
    : 0

  const formatUptime = (uptime: number) => {
    return `${uptime.toFixed(2)}%`
  }

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99) return "text-green-600"
    if (uptime >= 95) return "text-yellow-600" 
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Monitoring Insights</h2>
        <p className="text-muted-foreground text-sm">
          Overview of your website monitoring performance across all monitored sites
        </p>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Websites Status */}
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Websites Status</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{totalWebsites}</div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                {onlineWebsites} Online
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                {offlineWebsites} Offline
              </span>
            </div>
          </div>
        </div>

        {/* Average Uptime */}
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Average Uptime</h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <div className={`text-2xl font-bold ${getUptimeColor(avgUptime)}`}>
              {formatUptime(avgUptime)}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </div>
        </div>

        {/* Average Response Time */}
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Avg Response Time</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{Math.round(avgResponseTime)}ms</div>
            <p className="text-xs text-muted-foreground">Across all sites</p>
          </div>
        </div>

        {/* Downtime Events */}
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Downtime Events</h3>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-orange-600">{totalDowntimeEvents}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </div>
        </div>

        {/* Fastest Response */}
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Fastest Response</h3>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-green-600">{fastestResponse}ms</div>
            <p className="text-xs text-muted-foreground">Best performance</p>
          </div>
        </div>

        {/* Monitoring Coverage */}
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Coverage</h3>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Regions monitored</p>
          </div>
        </div>
      </div>

      {/* Detailed Website Breakdown */}
      {/* <div className="bg-card border rounded-lg p-4">
        <h3 className="font-medium mb-4">Website Performance Breakdown</h3>
        <div className="space-y-3">
          {websites.map((website) => (
            <div key={website.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  website.currentStatus === "UP" 
                    ? "bg-green-500" 
                    : website.currentStatus === "DOWN" 
                    ? "bg-red-500" 
                    : "bg-yellow-500"
                }`} />
                <div>
                  <div className="font-medium text-sm">{website.name}</div>
                  <div className="text-xs text-muted-foreground">{website.url}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-right">
                  <div className={`font-medium ${getUptimeColor(website.insights.uptime)}`}>
                    {formatUptime(website.insights.uptime)}
                  </div>
                  <div className="text-xs text-muted-foreground">uptime</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{website.insights.avgResponseTime}ms</div>
                  <div className="text-xs text-muted-foreground">avg response</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-orange-600">{website.insights.downtimeEvents}</div>
                  <div className="text-xs text-muted-foreground">incidents</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  )
}