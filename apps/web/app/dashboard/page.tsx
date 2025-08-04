"use client"

import ProtectedRoute from "../../components/auth/ProtectedRoute"
import { useSession } from "next-auth/react"

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          
          <div className="bg-card border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Welcome back!</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {session?.user?.name || 'Not provided'}</p>
              <p><strong>Email:</strong> {session?.user?.email}</p>
              <p><strong>User ID:</strong> {session?.user?.id}</p>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Your Websites</h2>
            <p className="text-muted-foreground">
              Website monitoring functionality will be added here.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}