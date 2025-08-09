"use client"

import ProtectedRoute from "../../components/auth/ProtectedRoute"
import { useSession } from "next-auth/react"
import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { useApiClient, fetchCurrentUser, type User as ApiUser } from "../../lib/api-client"
import { Button } from "@repo/ui"
import { Plus, Globe, Clock, CheckCircle, XCircle } from "lucide-react"
import TabList from "../../components/core-ui/TabList"
import InsightsOverview from "../../components/insights-overview"
import AddWebsitePopup from "../../components/core-ui/AddWebsitePopup"
import { getWebsiteOverviewData } from "../../lib/website-analytics"
import type { WebsiteOverviewData } from "../../lib/website-analytics"

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
  const [isLoadingInsights, setIsLoadingInsights] = useState(false)
  const [realWebsitesData, setRealWebsitesData] = useState<WebsiteOverviewData[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isAddWebsiteModalOpen, setIsAddWebsiteModalOpen] = useState(false)
  
  // Use refs to track if data has been fetched to avoid infinite loops
  const userFetched = useRef(false)
  const websitesFetched = useRef(false)
  
  // Use real data if available, fallback to demo data
  const websitesOverviewData = useMemo(() => {
    return realWebsitesData.length > 0 ? realWebsitesData : []
  }, [realWebsitesData])

  // Fetch user data from API
  const fetchUser = useCallback(async () => {
    if (isLoadingUser || userFetched.current) return
    
    setIsLoadingUser(true)
    userFetched.current = true
    
    try {
      const user = await fetchCurrentUser()
      setApiUser(user)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch user from API:', err)
      setError('Failed to load user data from API')
      userFetched.current = false // Reset on error to allow retry
    } finally {
      setIsLoadingUser(false)
    }
  }, [isLoadingUser])

  useEffect(() => {
    if (session?.user && !apiUser) {
      fetchUser()
    }
  }, [session?.user, apiUser, fetchUser])

  // Fetch websites data from API
  const fetchWebsites = useCallback(async (force: boolean = false) => {
    if (isLoadingWebsites || (websitesFetched.current && !force)) return
    
    setIsLoadingWebsites(true)
    websitesFetched.current = true
    
    try {
      const response = await apiClient.getWebsites()
      console.log('response', response)
      setWebsites(response.data || [])
      setError(null)
    } catch (err) {
      console.error('Failed to fetch websites:', err)
      setError('Failed to load websites. Make sure you are signed in.')
      websitesFetched.current = false // Reset on error to allow retry
    } finally {
      setIsLoadingWebsites(false)
    }
  }, [apiClient, isLoadingWebsites])

  useEffect(() => {
    if (session?.user && websites.length === 0) {
      fetchWebsites()
    }
  }, [session?.user, websites.length, fetchWebsites])

  // Poll websites every 5 minutes
  useEffect(() => {
    if (!session?.user) return
    
    // initial immediate refresh
    fetchWebsites(true)
    
    const intervalId = setInterval(() => {
      fetchWebsites(true)
    }, 5 * 60 * 1000) // 5 minutes
    
    return () => clearInterval(intervalId)
  }, [session?.user, fetchWebsites])

  // Handle add website submission
  const handleAddWebsite = useCallback(async (data: { url: string; alias: string; notificationSystem: string }) => {
    try {
      setError(null)
      const response = await apiClient.createWebsite({
        name: data.alias,
        url: data.url
      })

      if (response.data) {
        // Add the new website to the list
        setWebsites(prev => [...prev, response.data])
        setIsAddWebsiteModalOpen(false)
        
        // Show success message temporarily
        setError(null)
      }
    } catch (err) {
      console.error('Failed to add website:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to add website. Please try again.'
      setError(errorMessage)
    }
  }, [apiClient])

  // Fetch real website overview data with insights
  useEffect(() => {
    const fetchRealWebsiteData = async () => {
      const userId = (session?.user as { id?: string } | undefined)?.id
      if (userId && !isLoadingInsights && realWebsitesData.length === 0) {
        setIsLoadingInsights(true)
        try {
          const overviewData = await getWebsiteOverviewData(userId)
          setRealWebsitesData(overviewData)
          setError(null)
        } catch (err) {
          console.error('Failed to fetch website overview data:', err)
          setError('Failed to load website insights. Using fallback data.')
        } finally {
          setIsLoadingInsights(false)
        }
      }
    }

    fetchRealWebsiteData()
  }, [session?.user, realWebsitesData.length])

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
          <div className="bg-card border rounded-lg p-6 mb-6 hidden">
            <h2 className="text-xl font-semibold mb-4">Welcome back!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <h3 className="font-medium text-lg">NextAuth Session</h3>
              <p><strong>Name:</strong> {session?.user?.name || 'Not provided'}</p>
              <p><strong>Email:</strong> {session?.user?.email}</p>
                <p><strong>User ID:</strong> {(session?.user as { id?: string })?.id || 'Not available'}</p>
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

          

          {/* Website Monitoring Dashboard */}
          {/* <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Website Monitoring {realWebsitesData.length === 0 ? "(Demo)" : ""}
            </h2>
            {isLoadingInsights ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">Loading insights...</div>
              </div>
            ) : (
              <TabList initialWebsites={websitesOverviewData.map((website: WebsiteOverviewData) => ({
                id: website.id,
                name: website.name,
                url: website.url,
                createdAt: new Date(website.createdAt),
                updatedAt: new Date(website.updatedAt),
                user_id: website.user_id,
                currentStatus: website.currentStatus || "UNKNOWN"
              }))} />
            )}
          </div> */}

          {/* Original API Websites */}
          <div className="bg-card border rounded-lg p-6 mb-6 hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your API Websites</h2>
              <Button 
                className="gap-2" 
                size="sm"
                onClick={() => setIsAddWebsiteModalOpen(true)}
              >
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
                <h3 className="font-medium mb-2">No API websites yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first website to start real monitoring.
                </p>
                <Button 
                  className="gap-2"
                  onClick={() => setIsAddWebsiteModalOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Website
                </Button>
              </div>
            )}
          </div>

<TabList websites={websites} onAddWebsite={handleAddWebsite} isLoading={isLoadingWebsites}/>

          {/* Monitoring Insights */}
          {/* <div className="my-8 hidden">
            <InsightsOverview websites={websitesOverviewData} />
          </div> */}
        </div>
      </div>

      {/* Add Website Modal */}
      <AddWebsitePopup 
        isOpen={isAddWebsiteModalOpen}
        onClose={() => setIsAddWebsiteModalOpen(false)}
        onSubmit={handleAddWebsite}
      />
    </ProtectedRoute>
  )
}