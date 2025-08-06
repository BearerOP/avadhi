"use client"

import { useState } from "react"
import { Globe } from "lucide-react"
import { ProgressiveBlur } from "@repo/ui"
import AddWebsite from "./add-website"
import Link from "next/link"
import { WebsiteTickStatus } from "../lib/website-analytics"
import { getDemoLatestWebsiteStatus } from "../lib/website-analytics" // Keep for new website status
import type { WebsiteWithTicks } from "../lib/website-analytics"

export interface WebsiteWithStatus extends WebsiteWithTicks {
  currentStatus: WebsiteTickStatus
}

interface TabListProps {
  initialWebsites: WebsiteWithStatus[]
}

export default function TabList({ initialWebsites }: TabListProps) {
  const [websites, setWebsites] = useState<WebsiteWithStatus[]>(initialWebsites)

  const addNewWebsite = (newWebsiteData: Omit<WebsiteWithTicks, "id" | "createdAt" | "updatedAt" | "user_id">) => {
    // Generate a simple unique ID for demo purposes
    const newId = `demo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const now = new Date()

    const newWebsite: WebsiteWithStatus = {
      id: newId,
      name: newWebsiteData.name,
      url: newWebsiteData.url,
      createdAt: now,
      updatedAt: now,
      user_id: "demo-user", // Assign a demo user ID
      currentStatus: getDemoLatestWebsiteStatus(newId), // Get a demo status for the new website
    }
    setWebsites((prev) => [newWebsite, ...prev])
  }

  const getStatusColor = (status: WebsiteTickStatus) => {
    switch (status) {
      case WebsiteTickStatus.UP:
        return "bg-green-500"
      case WebsiteTickStatus.DOWN:
        return "bg-red-500"
      case WebsiteTickStatus.UNKNOWN:
        return "bg-yellow-500 animate-pulse"
      default:
        return "bg-gray-500"
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

  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMinutes < 1) return "Just added"
    if (diffMinutes < 60) return `Added ${diffMinutes}m ago`
    if (diffHours < 24) return `Added ${diffHours}h ago`
    return `Added ${diffDays}d ago`
  }

  return (
    <div className="space-y-4">
      <AddWebsite addNewWebsite={addNewWebsite} />

      <div className="relative mx-auto border rounded-xl max-h-[50vh] w-[50vw] bg-background overflow-hidden">
        <div className="relative h-[400px] w-full overflow-y-auto">
          <div className="flex flex-col gap-2 p-4">
            {websites.length > 0 ? (
              websites.map((website) => (
                <Link key={website.id} href={`/dashboard/${website.id}`}>
                  <div className="flex min-h-20 w-full items-center justify-between rounded-xl bg-card border p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-sm bg-muted flex items-center justify-center">
                        <Globe className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm">{website.name}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground">{website.url}</p>
                        <p className="text-xs text-muted-foreground">{formatRelativeTime(website.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(website.currentStatus)}`} />
                      <span className="text-xs font-medium">{getStatusText(website.currentStatus)}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex items-center justify-center h-32">
                <div className="text-muted-foreground">No demo websites available</div>
              </div>
            )}
          </div>
          <ProgressiveBlur position="bottom" height="40%" />
        </div>
      </div>
    </div>
  )
}