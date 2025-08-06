"use client"

import { useState } from "react"
import { ArrowLeft, Globe, Clock, TrendingUp, MapPin, Activity } from "lucide-react"
import { Button } from "@repo/ui"
import Link from "next/link"
import { WebsiteTickStatus } from "../lib/website-analytics"
import type { WebsiteWithTicks, WebsiteTick, WebsiteInsights } from "../lib/website-analytics"

interface WebsiteDashboardProps {
  website: WebsiteWithTicks
  insights: WebsiteInsights
  ticks: WebsiteTick[]
  currentStatus: WebsiteTickStatus
}

export default function WebsiteDashboard({ website, insights, ticks, currentStatus }: WebsiteDashboardProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>("all")

  const getStatusColor = (status: WebsiteTickStatus) => {
    switch (status) {
      case WebsiteTickStatus.UP:
        return "text-green-600 bg-green-50"
      case WebsiteTickStatus.DOWN:
        return "text-red-600 bg-red-50"
      case WebsiteTickStatus.UNKNOWN:
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusText = (status: WebsiteTickStatus) => {
    switch (status) {
      case WebsiteTickStatus.UP:
        return "Online"
      case WebsiteTickStatus.DOWN:
        return "Offline"
      case WebsiteTickStatus.UNKNOWN:
        return "Unknown"
      default:
        return "Unknown"
    }
  }

  const filteredTicks = selectedRegion === "all" 
    ? ticks 
    : ticks.filter(tick => tick.region === selectedRegion)

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-muted flex items-center justify-center">
            <Globe className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{website.name}</h1>
            <p className="text-muted-foreground">{website.url}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentStatus)}`}>
          {getStatusText(currentStatus)}
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Uptime</h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{insights.uptime.toFixed(2)}%</div>
          <p className="text-xs text-muted-foreground">Last 24 hours</p>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Avg Response Time</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{Math.round(insights.averageResponseTime)}ms</div>
          <p className="text-xs text-muted-foreground">Last 24 hours</p>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Checks</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{insights.totalChecks}</div>
          <p className="text-xs text-muted-foreground">Last 24 hours</p>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Regions</h3>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{insights.regions.length}</div>
          <p className="text-xs text-muted-foreground">Monitoring regions</p>
        </div>
      </div>

      {/* Region Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by Region:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedRegion === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedRegion("all")}
          >
            All Regions
          </Button>
          {insights.regions.map((region) => (
            <Button
              key={region}
              variant={selectedRegion === region ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRegion(region)}
            >
              {region}
            </Button>
          ))}
        </div>
      </div>

      {/* Recent Checks */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5" />
          Recent Checks
          {selectedRegion !== "all" && (
            <span className="text-sm font-normal text-muted-foreground">
              ({selectedRegion})
            </span>
          )}
        </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredTicks.slice(0, 20).map((tick) => (
              <div key={tick.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    tick.status === WebsiteTickStatus.UP 
                      ? "bg-green-500" 
                      : tick.status === WebsiteTickStatus.DOWN 
                      ? "bg-red-500" 
                      : "bg-yellow-500"
                  }`} />
                  <div>
                    <div className="text-sm font-medium">
                      {getStatusText(tick.status)}
                      {tick.responseTime && (
                        <span className="text-muted-foreground ml-2">
                          {tick.responseTime}ms
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {tick.region} • {formatDateTime(tick.checkedAt)}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDuration(tick.checkedAt)}
                </div>
              </div>
            ))}
          </div>
      </div>

      {/* Status Summary */}
      <div className="mt-8">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Status Summary (Last 24h)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{insights.statusCounts.up}</div>
                <div className="text-sm text-muted-foreground">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{insights.statusCounts.down}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{insights.statusCounts.unknown}</div>
                <div className="text-sm text-muted-foreground">Unknown</div>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}