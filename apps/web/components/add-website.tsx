"use client"

import type React from "react"

import { useState } from "react"
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui"
import { Plus, X, Database } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Updated Website interface to match the WebsiteWithTicks from website-analytics.ts
interface Website {
  id: string
  name: string // Changed from title to name to match WebsiteWithTicks
  url: string
  favicon: string
  status: "online" | "offline" | "loading" // This is a client-side status, not directly from DB schema
  alias?: string
  notification?: "sms" | "email" | "none"
  createdAt: Date // Added to match WebsiteWithTicks
  updatedAt: Date // Added to match WebsiteWithTicks
  user_id: string | null // Added to match WebsiteWithTicks
}

interface AddWebsiteProps {
  // Updated addNewWebsite to match the Omit type for WebsiteWithTicks
  addNewWebsite: (
    website: Omit<Website, "id" | "status" | "favicon" | "createdAt" | "updatedAt" | "user_id"> & { name: string },
  ) => void
}

export default function AddWebsite({ addNewWebsite }: AddWebsiteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    url: "",
    alias: "",
    notification: "none" as "sms" | "email" | "none",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.url) return

    // Extract domain name for name if no alias provided
    let name: string
    try {
      name = formData.alias || new URL(formData.url).hostname.replace("www.", "")
    } catch {
      name = formData.alias || formData.url
    }

    addNewWebsite({
      name, // Use 'name' instead of 'title'
      url: formData.url,
      alias: formData.alias,
      notification: formData.notification,
    })

    // Reset form and close popup
    setFormData({ url: "", alias: "", notification: "none" })
    setIsOpen(false)
  }

  const handleCancel = () => {
    setFormData({ url: "", alias: "", notification: "none" })
    setIsOpen(false)
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Demo Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 w-[50vw]">
        <div className="flex items-center gap-2 text-blue-700">
          <Database className="h-4 w-4" />
          <span className="text-sm">Demo Mode: Add websites to see simulated monitoring data</span>
        </div>
      </div>

      <div className="flex justify-center p-4 relative mx-auto border rounded-3xl max-h-[50vh] w-[50vw] bg-background overflow-hidden">
        <Button
          onClick={() => setIsOpen(true)}
          className="transition-all duration-300 border border-dashed border-teal-500 bg-transparent hover:bg-teal-950 text-muted-foreground flex min-h-20 w-full items-center justify-center rounded-xl cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Website (Demo)
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="w-[50vw] bg-card border rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New Website (Demo)</h3>
              <Button variant="ghost" size="sm" onClick={handleCancel} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Website URL (Demo)</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                  required
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Demo: Any URL will generate simulated monitoring data</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alias">Alias Name (Demo)</Label>
                <Input
                  id="alias"
                  type="text"
                  placeholder="My Website (optional)"
                  value={formData.alias}
                  onChange={(e) => setFormData((prev) => ({ ...prev, alias: e.target.value }))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification">Notification System (Demo)</Label>
                <Select
                  value={formData.notification}
                  onValueChange={(value: "sms" | "email" | "none") =>
                    setFormData((prev) => ({ ...prev, notification: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select notification method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="email">Email (Demo)</SelectItem>
                    <SelectItem value="sms">SMS (Demo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700">
                  Add Website (Demo)
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}