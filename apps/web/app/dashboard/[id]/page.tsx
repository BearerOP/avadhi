import { notFound } from "next/navigation"
import {
  getDemoWebsiteById,
  calculateDemoInsights,
  generateDemoTicks,
  getDemoLatestWebsiteStatus,
} from "../../../lib/website-analytics"
import WebsiteDashboard from "../../../components/website-dashboard"

// Commented out real database integration
/*
import {
  getWebsiteById,
  calculateWebsiteInsights,
  getWebsiteTicks,
  getLatestWebsiteStatus,
} from "@/lib/website-analytics"
*/

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function DashboardPage({ params }: PageProps) {
  const { id } = await params

  // Validate UUID format or demo ID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  const demoIdRegex = /^demo-\d+-[a-z0-9]+$/
  
  if (!uuidRegex.test(id) && !demoIdRegex.test(id)) {
    notFound()
  }

  // Use demo data for now
  const website = getDemoWebsiteById(id)

  if (!website) {
    notFound()
  }

  // Generate demo insights and ticks
  const insights = calculateDemoInsights(id)
  const ticks = generateDemoTicks(id, 100, 24) // Last 100 ticks from past 24 hours
  const currentStatus = getDemoLatestWebsiteStatus(id)

  // Commented out real database calls
  /*
  // Fetch website data
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
  */

  return <WebsiteDashboard website={website} insights={insights} ticks={ticks} currentStatus={currentStatus} />
}

// Generate static params for demo websites
export async function generateStaticParams() {
  return [
    { id: "550e8400-e29b-41d4-a716-446655440001" },
    { id: "550e8400-e29b-41d4-a716-446655440002" },
    { id: "550e8400-e29b-41d4-a716-446655440003" },
    { id: "550e8400-e29b-41d4-a716-446655440004" },
    { id: "550e8400-e29b-41d4-a716-446655440005" },
  ]
}