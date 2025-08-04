"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@repo/ui"
import { LogOut, User } from "lucide-react"

export default function UserProfile() {
  const { data: session, status } = useSession()

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

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {session.user?.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
        )}
        <span className="text-sm font-medium">{session.user?.name || session.user?.email}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => signOut({ callbackUrl: '/' })}
        className="gap-2"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </Button>
    </div>
  )
}