// Type definitions for NextAuth

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      provider?: string | null
      createdAt?: Date | null
    }
  }

  interface NextAuthOptions {
    providers: Provider[]
  }

  interface Provider {
    id: string
    name: string
    type: string
    signinUrl: string
    callbackUrl: string
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    provider?: string | null
    providerId?: string | null
    createdAt?: Date | null
    updatedAt?: Date | null
  }
}