"use client"

import { useState } from "react"
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, ScrollArea, Separator, Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui"
import Link from "next/link"
import { WebsiteTickStatus } from "../lib/website-analytics"
import {
  ArrowLeft,
  Globe,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Zap,
  Calendar,
  Settings,
  Download,
  RefreshCw,
  MapPin,
  Server,
  Database,
} from "lucide-react"
import type { WebsiteWithTicks, WebsiteTickData, WebsiteInsights } from "../lib/website-analytics"

interface WebsiteDashboardProps {
  website: WebsiteWithTicks
  insights: WebsiteInsights
  ticks: WebsiteTickData[]
  currentStatus: WebsiteTickStatus
}

export default function WebsiteDashboard({ website, insights, ticks, currentStatus }: WebsiteDashboardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // In a real app, this would trigger a revalidation
    setTimeout(() => {
      window.location.reload()
      setIsRefreshing(false)
    }, 1000)
  }

  const getStatusColor = (status: WebsiteTickStatus) => {
    switch (status) {
      case WebsiteTickStatus.UP:
        return "text-green-600 bg-background border-teal-600"
      case WebsiteTickStatus.DOWN:
        return "text-red-600 bg-red-50 border-red-200"
      case WebsiteTickStatus.UNKNOWN:
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = (status: WebsiteTickStatus) => {
    switch (status) {
      case WebsiteTickStatus.UP:
        return <CheckCircle className="h-4 w-4" />
      case WebsiteTickStatus.DOWN:
        return <XCircle className="h-4 w-4" />
      case WebsiteTickStatus.UNKNOWN:
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getStatusBadgeVariant = (status: WebsiteTickStatus) => {
    switch (status) {
      case WebsiteTickStatus.UP:
        return "default"
      case WebsiteTickStatus.DOWN:
        return "destructive"
      default:
        return "secondary"
    }
  }

  const formatTime = (date: Date | null) => {
    if (!date) return "N/A"
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A"
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMinutes < 1) return "Just now"
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
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
                  <p className="text-sm text-muted-foreground">{website.url}</p>
                </div>
                <Badge variant={getStatusBadgeVariant(currentStatus)} className="ml-2 border border-gray-500">
                  {currentStatus.toLowerCase()}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh Demo
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Demo
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Insights Panel */}
          <div className="lg:col-span-1 space-y-4 overflow-y-auto">
            <h2 className="sticky top-0 bg-background z-10 pb-4 text-xl font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Website Insights
            </h2>

            <div className="space-y-4 overflow-y-auto">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Uptime</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{insights.uptime}%</div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold flex items-center gap-2">
                    <Zap className="h-6 w-6 text-yellow-500" />
                    {insights.avgResponseTime}ms
                  </div>
                  <p className="text-xs text-muted-foreground">Last 24 hours</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Last Check</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDate(insights.lastCheck)}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                <Card className="p-4">
                  <div className="text-2xl font-bold">{insights.totalChecks}</div>
                  <div className="text-xs text-muted-foreground">Total Checks</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-red-600">{insights.downtimeEvents}</div>
                  <div className="text-xs text-muted-foreground">Downtime Events</div>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Fastest Response:</span>
                    <span className="font-medium text-green-600">{insights.fastestResponse}ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Slowest Response:</span>
                    <span className="font-medium text-red-600">{insights.slowestResponse}ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Longest Downtime:</span>
                    <span className="font-medium">{insights.longestDowntime}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Region Stats */}
              {insights.regionStats.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Regional Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {insights.regionStats.map((stat) => (
                      <div key={stat.region} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{stat.region}</span>
                          <Badge variant="outline" className="text-xs">
                            {stat.uptime.toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{stat.avgResponseTime}ms avg</span>
                          <span>{formatRelativeTime(stat.lastCheck || new Date())}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Activity Panel */}
          <div className="lg:col-span-2 space-y-4 ">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Website Activity
            </h2>

            <Tabs defaultValue="logs" className="h-full">
              <TabsList className="bg-background">
                <TabsTrigger value="logs">Recent Checks</TabsTrigger>
                <TabsTrigger value="errors">Errors Only</TabsTrigger>
              </TabsList>

              <TabsContent value="logs" className="h-full ">
                <Card className="h-fit">
                  <CardContent className="p">
                    <ScrollArea className="max-h-[500px] h-full p-4 overflow-y-auto">
                      <div className="space-y-3">
                        {ticks.length > 0 ? (
                          ticks.map((tick, index) => (
                            <div key={tick.id}>
                              <div
                                className={`flex items-start gap-3 p-4 rounded-lg border ${getStatusColor(tick.status)}`}
                              >
                                <div className="mt-0.5">{getStatusIcon(tick.status)}</div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium">
                                        {tick.status === WebsiteTickStatus.UP
                                          ? "Health check passed"
                                          : tick.status === WebsiteTickStatus.DOWN
                                            ? "Health check failed"
                                            : "Health check unknown"}
                                      </p>
                                      <Badge variant="outline" className="text-xs">
                                        <Server className="h-3 w-3 mr-1" />
                                        {tick.Region.name}
                                      </Badge>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      {formatRelativeTime(tick.createdAt)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                    <span>Response: {tick.response_time_ms}ms</span>
                                    <span>
                                      Status: {tick.status_code} {tick.status_text}
                                    </span>
                                    {tick.error_message && (
                                      <span className="text-red-600">Error: {tick.error_message}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {index < ticks.length - 1 && <Separator className="my-3" />}
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center justify-center h-32">
                            <div className="text-muted-foreground">No monitoring data available</div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="errors" className="h-full">
                <Card className="h-full">
                  <CardContent className="p-0">
                    <ScrollArea className="max-h-[600px] h-full p-4">
                      <div className="space-y-3">
                        {ticks.filter((tick) => tick.status === WebsiteTickStatus.DOWN).length > 0 ? (
                          ticks
                            .filter((tick) => tick.status === WebsiteTickStatus.DOWN)
                            .map((tick, index) => (
                              <div key={tick.id}>
                                <div className="flex items-start gap-3 p-4 rounded-lg border border-red-200 bg-red-50 text-red-600">
                                  <div className="mt-0.5">
                                    <XCircle className="h-4 w-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium">Health check failed</p>
                                        <Badge variant="outline" className="text-xs">
                                          <Server className="h-3 w-3 mr-1" />
                                          {tick.Region.name}
                                        </Badge>
                                      </div>
                                      <span className="text-xs text-muted-foreground">
                                        {formatRelativeTime(tick.createdAt)}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 text-xs">
                                      <span>Response: {tick.response_time_ms}ms</span>
                                      <span>
                                        Status: {tick.status_code} {tick.status_text}
                                      </span>
                                      {tick.error_message && (
                                        <span className="font-medium">Error: {tick.error_message}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {index < ticks.filter((tick) => tick.status === WebsiteTickStatus.DOWN).length - 1 && (
                                  <Separator className="my-3" />
                                )}
                              </div>
                            ))
                        ) : (
                          <div className="flex items-center justify-center h-32">
                            <div className="text-muted-foreground">No errors in recent checks</div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}