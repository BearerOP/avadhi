import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prismaClient } from "store/client"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prismaClient),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/', // Custom sign-in page
  },
  cookies: {
    sessionToken: {
      name: '__Secure-next-auth.session-token',
      options: {
        domain: '.avadhi.pro',
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax'
      }
    },
    callbackUrl: {
      name: '__Secure-next-auth.callback-url',
      options: {
        domain: '.avadhi.pro',
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax'
      }
    },
    csrfToken: {
      name: '__Host-next-auth.csrf-token',
      options: {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax'
      }
    }
  },
  callbacks: {
    async signIn({ user, account, profile }: any) {
      // Simply allow sign-in - let PrismaAdapter handle everything
      return true;
    },

    async session({ session, user }: any) {
      // Minimal session callback - just add user ID
      if (session?.user && user?.id) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  session: {
    strategy: "database",
  },
  secret: process.env.NEXTAUTH_SECRET,
}