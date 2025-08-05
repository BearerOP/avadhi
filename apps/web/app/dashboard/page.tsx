"use client"

import ProtectedRoute from "../../components/auth/ProtectedRoute"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useApiClient, fetchCurrentUser, type User as ApiUser } from "../../lib/api-client"
import { Button } from "@repo/ui"
import { Plus, Globe, Clock, CheckCircle, XCircle } from "lucide-react"

interface Website {
  id: string
  name: string
  url: string
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const apiClient = useApiClient()
  const [apiUser, setApiUser] = useState<ApiUser | null>(null)
  const [websites, setWebsites] = useState<Website[]>([])
  const [isLoadingUser, setIsLoadingUser] = useState(false)
  const [isLoadingWebsites, setIsLoadingWebsites] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch user data from API
  useEffect(() => {
    if (session?.user?.id && !apiUser && !isLoadingUser) {
      setIsLoadingUser(true)
      fetchCurrentUser()
        .then((user) => {
          setApiUser(user)
          setError(null)
        })
        .catch((err) => {
          console.error('Failed to fetch user from API:', err)
          setError('Failed to load user data from API')
        })
        .finally(() => {
          setIsLoadingUser(false)
        })
    }
  }, [session?.user?.id, apiUser]) // Only depend on user ID and apiUser state

  // Fetch websites data from API
  useEffect(() => {
    if (session?.user?.id && websites.length === 0 && !isLoadingWebsites) {
      setIsLoadingWebsites(true)
      apiClient.getWebsites()
        .then((response) => {
          setWebsites(response.data || [])
          setError(null)
        })
        .catch((err) => {
          console.error('Failed to fetch websites:', err)
          setError('Failed to load websites. Make sure you are signed in.')
        })
        .finally(() => {
          setIsLoadingWebsites(false)
        })
    }
  }, [session?.user?.id, websites.length]) // Only depend on user ID and websites length

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          
          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-500">{error}</p>
              </div>
            </div>
          )}

          {/* User Info */}
          <div className="bg-card border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Welcome back!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium text-lg">NextAuth Session</h3>
                <p><strong>Name:</strong> {session?.user?.name || 'Not provided'}</p>
                <p><strong>Email:</strong> {session?.user?.email}</p>
                <p><strong>User ID:</strong> {session?.user?.id}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Backend API Data</h3>
                {isLoadingUser ? (
                  <p className="text-muted-foreground">Loading from API...</p>
                ) : apiUser ? (
                  <>
                    <p><strong>Name:</strong> {apiUser.name}</p>
                    <p><strong>Email:</strong> {apiUser.email}</p>
                    <p><strong>Provider:</strong> {apiUser.provider || 'Local'}</p>
                    <p><strong>API User ID:</strong> {apiUser.id}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-green-500 text-sm">API Integration Working!</span>
                    </div>
                  </>
                ) : (
                  <p className="text-red-500">Failed to load API data</p>
                )}
              </div>
            </div>
          </div>

          {/* Websites */}
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your Websites</h2>
              <Button className="gap-2" size="sm">
                <Plus className="w-4 h-4" />
                Add Website
              </Button>
            </div>
            
            {isLoadingWebsites ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-5 h-5 animate-spin" />
                Loading websites from API...
              </div>
            ) : websites.length > 0 ? (
              <div className="space-y-3">
                {websites.map((website) => (
                  <div 
                    key={website.id} 
                    className="flex items-center gap-3 p-3 border rounded-lg bg-background"
                  >
                    <Globe className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <h3 className="font-medium">{website.name}</h3>
                      <p className="text-sm text-muted-foreground">{website.url}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Added {new Date(website.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium mb-2">No websites yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first website to start monitoring.
                </p>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Your First Website
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}