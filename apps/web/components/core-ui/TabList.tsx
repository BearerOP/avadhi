"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ScrollArea, ProgressiveBlur } from "@repo/ui"
import { Globe } from "lucide-react"
import AddWebsite from "./AddWebsite"

interface Website {
  id: number
  title: string
  url: string
  favicon: string
  status: "online" | "offline" | "loading"
}

const initialWebsites: Website[] = [
  {
    id: 1,
    title: "Google",
    url: "https://google.com",
    favicon: "https://www.google.com/favicon.ico",
    status: "online",
  },
  {
    id: 2,
    title: "GitHub",
    url: "https://github.com",
    favicon: "https://github.com/favicon.ico",
    status: "online",
  },
  {
    id: 3,
    title: "Stack Overflow",
    url: "https://stackoverflow.com",
    favicon: "https://stackoverflow.com/favicon.ico",
    status: "offline",
  },
  {
    id: 4,
    title: "Vercel",
    url: "https://vercel.com",
    favicon: "https://vercel.com/favicon.ico",
    status: "online",
  },
  {
    id: 5,
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    favicon: "https://developer.mozilla.org/favicon-48x48.png",
    status: "loading",
  },
  {
    id: 6,
    title: "Reddit",
    url: "https://reddit.com",
    favicon: "https://reddit.com/favicon.ico",
    status: "online",
  },
  {
    id: 7,
    title: "Twitter",
    url: "https://twitter.com",
    favicon: "https://twitter.com/favicon.ico",
    status: "offline",
  },
  {
    id: 8,
    title: "YouTube",
    url: "https://youtube.com",
    favicon: "https://youtube.com/favicon.ico",
    status: "online",
  },
  {
    id: 9,
    title: "LinkedIn",
    url: "https://linkedin.com",
    favicon: "https://linkedin.com/favicon.ico",
    status: "loading",
  },
  {
    id: 10,
    title: "Discord",
    url: "https://discord.com",
    favicon: "https://discord.com/favicon.ico",
    status: "online",
  },
  {
    id: 11,
    title: "Figma",
    url: "https://figma.com",
    favicon: "https://figma.com/favicon.ico",
    status: "offline",
  },
  {
    id: 12,
    title: "Notion",
    url: "https://notion.so",
    favicon: "https://notion.so/favicon.ico",
    status: "online",
  },
]

export default function TabList() {
  const [websites, setWebsites] = useState<Website[]>(initialWebsites)

  const getStatusColor = (status: Website["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "offline":
        return "bg-red-500"
      case "loading":
        return "bg-yellow-500 animate-pulse"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: Website["status"]) => {
    switch (status) {
      case "online":
        return "Online"
      case "offline":
        return "Offline"
      case "loading":
        return "Checking..."
      default:
        return "Unknown"
    }
  }

  const addNewWebsite = (data: { url: string; alias: string; notificationSystem: string }) => {
    // Ensure URL has protocol
    const formattedUrl = data.url.startsWith('http') ? data.url : `https://${data.url}`;
    
    // Extract domain for favicon
    const domain = new URL(formattedUrl).hostname;
    const faviconUrl = `https://${domain}/favicon.ico`;

    const newWebsite: Website = {
      id: Date.now(),
      title: data.alias,
      url: formattedUrl,
      favicon: faviconUrl,
      status: "loading", // Start with loading status
    }

    setWebsites((prev) => [...prev, newWebsite]);
    
    // TODO: Here you can also store the notification system preference
    // For now, we'll just log it
    console.log(`Website added with notification system: ${data.notificationSystem}`);
  }

  return (
    <div className="space-y-4">
      <AddWebsite addNewWebsite={addNewWebsite} />

      <motion.div 
        layout
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="relative mx-auto border rounded-xl max-h-[50vh] w-[50vw] bg-background overflow-hidden mb-12"
      >
        <ScrollArea className="relative h-[400px] w-full overflow-scroll">
        
          <div className="flex flex-col gap-2 p-4 pb-18">
            {websites.map((website) => (
              <div
                key={website.id}
                className="flex min-h-20 w-full items-center justify-between rounded-xl bg-card border p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={website.favicon || "/placeholder.svg?height=24&width=24&query=website"}
                      alt={`${website.title} favicon`}
                      className="w-6 h-6 rounded-sm"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                        target.nextElementSibling?.classList.remove("hidden")
                      }}
                    />
                    <Globe className="w-6 h-6 text-muted-foreground hidden" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-medium text-sm">{website.title}</h3>
                    <p className="text-xs text-muted-foreground">{website.url}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(website.status)}`} />
                  <span className="text-xs font-medium">{getStatusText(website.status)}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <ProgressiveBlur className=" absolute inset-x-0 bottom-0 z-50 rounded-b-xl" position="bottom" height="10%" />
        <ProgressiveBlur className=" absolute inset-x-0 top-0 z-50 rounded-t-xl" position="top" height="10%" />

      </motion.div>
    </div>
  )
}
