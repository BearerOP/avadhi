"use client"

import prisma from "store/client"
import { WebsiteTickStatus } from "./website-analytics"

// Seed function to create demo data in the database
export async function seedDemoWebsiteData(userId: string) {
  try {
    console.log('Seeding demo data for user:', userId)

    // Create demo regions first
    const regions = await Promise.all([
      prisma.region.upsert({
        where: { id: "region-us-east-1" },
        update: {},
        create: {
          id: "region-us-east-1",
          name: "US East (N. Virginia)"
        }
      }),
      prisma.region.upsert({
        where: { id: "region-us-west-2" },
        update: {},
        create: {
          id: "region-us-west-2", 
          name: "US West (Oregon)"
        }
      }),
      prisma.region.upsert({
        where: { id: "region-eu-west-1" },
        update: {},
        create: {
          id: "region-eu-west-1",
          name: "Europe (Ireland)"
        }
      }),
      prisma.region.upsert({
        where: { id: "region-ap-southeast-1" },
        update: {},
        create: {
          id: "region-ap-southeast-1",
          name: "Asia Pacific (Singapore)"
        }
      })
    ])

    // Create demo websites
    const websites = await Promise.all([
      prisma.website.upsert({
        where: { url: "https://google.com" },
        update: { user_id: userId },
        create: {
          name: "Google",
          url: "https://google.com", 
          user_id: userId
        }
      }),
      prisma.website.upsert({
        where: { url: "https://github.com" },
        update: { user_id: userId },
        create: {
          name: "GitHub",
          url: "https://github.com",
          user_id: userId
        }
      }),
      prisma.website.upsert({
        where: { url: "https://stackoverflow.com" },
        update: { user_id: userId },
        create: {
          name: "Stack Overflow", 
          url: "https://stackoverflow.com",
          user_id: userId
        }
      })
    ])

    // Create sample ticks for each website
    for (const website of websites) {
      const tickData = []
      const now = new Date()
      
      // Create 20 ticks over the last 5 hours (15 min intervals)
      for (let i = 0; i < 20; i++) {
        const timestamp = new Date(now.getTime() - i * 15 * 60 * 1000)
        const region = regions[Math.floor(Math.random() * regions.length)]
        
        // 90% up, 10% down for demo
        const isUp = Math.random() > 0.1
        
        tickData.push({
          website_id: website.id,
          region_id: region.id,
          status: isUp ? WebsiteTickStatus.UP : WebsiteTickStatus.DOWN,
          response_time_ms: isUp ? Math.floor(Math.random() * 500) + 100 : 0,
          status_code: isUp ? 200 : 500,
          status_text: isUp ? "OK" : "Internal Server Error",
          error_message: isUp ? null : "Connection timeout",
          createdAt: timestamp,
          updatedAt: timestamp
        })
      }

      // Insert all ticks for this website
      await prisma.websiteTick.createMany({
        data: tickData,
        skipDuplicates: true
      })
    }

    console.log('Demo data seeded successfully!')
    return { websites, regions, tickCount: websites.length * 20 }

  } catch (error) {
    console.error('Error seeding demo data:', error)
    throw error
  }
}