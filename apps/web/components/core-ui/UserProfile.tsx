"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@repo/ui"
import { LogOut, User, Settings } from "lucide-react"
import { useState, useEffect } from "react"
import { fetchCurrentUser, type User as ApiUser } from "../../lib/api-client"

export default function UserProfile() {
  const { data: session, status } = useSession()
  const [apiUser, setApiUser] = useState<ApiUser | null>(null)
  const [isLoadingApiUser, setIsLoadingApiUser] = useState(false)

  // Fetch user data from backend API when session is available
  useEffect(() => {
    if (session?.user?.id && !apiUser && !isLoadingApiUser) {
      setIsLoadingApiUser(true)
      fetchCurrentUser()
        .then((user) => {
          setApiUser(user)
        })
        .catch((error) => {
          console.error('Failed to fetch user from API:', error)
        })
        .finally(() => {
          setIsLoadingApiUser(false)
        })
    }
  }, [session?.user?.id, apiUser]) // Only trigger when user ID changes or apiUser is reset

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-muted animate-pulse rounded-full"></div>
        <div className="w-20 h-4 bg-muted animate-pulse rounded"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  // Use API user data if available, fallback to session data
  const displayUser = apiUser || session.user

  return (
    <div className="flex items-center gap-2">
      {/* User Avatar */}
      <div className="relative">
        {displayUser?.image ? (
          <img
            src={displayUser.image}
            alt={displayUser.name || "User"}
            className="w-8 h-8 rounded-full border-2 border-teal-300/30 hover:border-teal-300/50 transition-colors"
          />
        ) : (
          <div className="w-8 h-8 bg-teal-600/20 rounded-full flex items-center justify-center border-2 border-teal-300/30 hover:border-teal-300/50 transition-colors">
            <User className="w-4 h-4 text-teal-300" />
          </div>
        )}
        
        {/* Provider indicator dot */}
        {apiUser?.provider && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-teal-400 flex items-center justify-center text-xs bg-teal-600">
            {apiUser.provider === 'google' ? (
              <span className="text-white text-xs">G</span>
            ) : apiUser.provider === 'github' ? (
              <span className="text-white text-xs">H</span>
            ) : (
              <span className="text-white text-xs">L</span>
            )}
          </div>
        )}
      </div>
      
      {/* Sign Out Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => signOut({ callbackUrl: '/' })}
        className="gap-1 bg-teal-600/20 border-teal-400/30 text-gray-200 hover:bg-teal-600/30 hover:text-white px-2 py-1 h-8 text-xs rounded-lg cursor-pointer"
      >
        <LogOut className="w-3 h-3" />
        <span className="hidden sm:inline">Sign Out</span>
      </Button>
    </div>
  )
}