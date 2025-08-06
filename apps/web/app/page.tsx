'use client'
import { useSession } from 'next-auth/react'
import { useState, useEffect, useCallback } from 'react'
import { useApiClient } from '../lib/api-client'
import Hero from '../components/core-ui/Hero';
import TabList from '../components/core-ui/TabList';

interface Website {
  id: string
  name: string
  url: string
  createdAt: string
  updatedAt: string
}


export default function Landing() {
  const { data: session } = useSession()
  const apiClient = useApiClient()
  const [websites, setWebsites] = useState<Website[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user's websites
  const fetchWebsites = useCallback( async () => {
    if (!session?.user) {
      console.log('session?.user',session?.user);
      return}
    
    setIsLoading(true)
    try {
      const response = await apiClient.getWebsites()
      console.log('response',response);
      
      setWebsites(response.data || [])
    } catch (err) {
      console.error('Failed to fetch websites:', err)
      setWebsites([])
    } 
    finally {
      setIsLoading(false)
    }
  }, [session?.user])

  // Handle add website submission
  const handleAddWebsite = useCallback(async (data: { url: string; alias: string; notificationSystem: string }) => {
    try {
      const response = await apiClient.createWebsite({
        name: data.alias,
        url: data.url
      })

      if (response.data) {
        setWebsites(prev => [...prev, response.data])
      }
    } catch (err) {
      console.error('Failed to add website:', err)
      throw err // Let the component handle the error display
    }
  }, [apiClient])

  useEffect(() => {
    if (session?.user) {
      fetchWebsites()
    }
  }, [session?.user, fetchWebsites])

  return (
    <div className="flex flex-col">
      <Hero/>
      
      <TabList 
        websites={session?.user ? websites : []}
        onAddWebsite={handleAddWebsite}
        isLoading={isLoading}
      />
    </div>
  );
}