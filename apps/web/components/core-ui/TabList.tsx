"use client"

import { motion } from "framer-motion"
import { ScrollArea, ProgressiveBlur } from "@repo/ui"
import { Globe } from "lucide-react"
import AddWebsite from "./AddWebsite"
import { useRouter } from "next/navigation"

interface Website {
  id: string
  name: string
  url: string
  createdAt: string
  updatedAt: string
}

interface TabListProps {
  websites: Website[]
  onAddWebsite: (data: { url: string; alias: string; notificationSystem: string }) => Promise<void>
  isLoading?: boolean
}

export default function TabList({ websites, onAddWebsite, isLoading = false }: TabListProps) {
  const router = useRouter()
  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://${domain}/favicon.ico`;
    } catch {
      return null;
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
      className="space-y-4"
    >
      <AddWebsite addNewWebsite={onAddWebsite} />

      <motion.div 
        layout
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="relative mx-auto border rounded-xl max-h-[60vh] min-w-2xl bg-background overflow-hidden mb-12"
      >
        <ScrollArea className="relative h-[500px] w-full overflow-scroll">
          <div className="flex flex-col gap-2 p-4 pb-18">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Loading websites...</div>
              </div>
            ) : websites.length > 0 ? (
              websites.map((website) => (
                <div
                  onClick={() => {
                    console.log('website',website.id);
                    
                    router.push(`/dashboard/${website.id}`)
                  }}
                  key={website.id}
                  className="flex min-h-20 w-full items-center justify-between rounded-xl bg-card border p-4 hover:bg-accent/50  hover:cursor-pointer hover:-translate-y-[2px] transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={getFaviconUrl(website.url) || "/placeholder.svg?height=24&width=24&query=website"}
                        alt={`${website.name} favicon`}
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
                      <h3 className="font-medium text-sm">{website.name}</h3>
                      <p className="text-xs text-muted-foreground">{website.url}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs font-medium">Monitor</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No websites yet</h3>
                <p className="text-muted-foreground">
                  Add your first website to start monitoring
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
        <ProgressiveBlur className=" absolute inset-x-0 bottom-0 z-[49] rounded-b-xl" position="bottom" height="10%" />
        <ProgressiveBlur className=" absolute inset-x-0 top-0 z-[49] rounded-t-xl" position="top" height="10%" />

      </motion.div>
    </motion.div>
  )
}
