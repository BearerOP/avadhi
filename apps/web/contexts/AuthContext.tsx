"use client"

import { createContext, useContext } from 'react'
import { SessionProvider } from 'next-auth/react'

interface AuthContextProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthContextProps) {
  return <SessionProvider>{children}</SessionProvider>
}