import { notFound } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../lib/auth"
import {
  getWebsiteById,
  calculateWebsiteInsights,
  getWebsiteTicks,
  getLatestWebsiteStatus,
} from "../../../lib/website-analytics"
import WebsiteDashboard from "../../../components/website-dashboard"

// Demo functions for fallback
import {
  getDemoWebsiteById,
  calculateDemoInsights,
  generateDemoTicks,
  getDemoLatestWebsiteStatus,
} from "../../../lib/website-analytics"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function DashboardPage({ params }: PageProps) {
  const { id } = await params
  
  // Get the current session
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    notFound()
  }

  // Validate UUID format 
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  
  if (!uuidRegex.test(id)) {
    notFound()
  }

  try {
    // Fetch website data from database
    const website = await getWebsiteById(id)

    if (!website) {
      notFound()
    }

    // Fetch insights and ticks in parallel
    const [insights, ticks, currentStatus] = await Promise.all([
      calculateWebsiteInsights(id),
      getWebsiteTicks(id, 100, 24), // Last 100 ticks from past 24 hours
      getLatestWebsiteStatus(id),
    ])

    return <WebsiteDashboard website={website} insights={insights} ticks={ticks} currentStatus={currentStatus} />
  } catch (error) {
    console.error("Error loading website data:", error)
    
    // Fallback to demo data if database fails
    const demoWebsite = getDemoWebsiteById(id)
    
    if (!demoWebsite) {
      notFound()
    }

    const demoInsights = calculateDemoInsights(id)
    const demoTicks = generateDemoTicks(id, 100)
    const demoStatus = getDemoLatestWebsiteStatus(id)

    return <WebsiteDashboard website={demoWebsite} insights={demoInsights} ticks={demoTicks} currentStatus={demoStatus} />
  }
}
