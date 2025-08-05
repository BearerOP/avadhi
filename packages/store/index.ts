import { PrismaClient } from "./generated/prisma/client"
import dotenv from 'dotenv';
dotenv.config();

// Ensure environment variables are loaded
console.log(process.env.DATABASE_URL,'DATABASE_URL');
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set. Please check your .env file.');
}

export const prismaClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});

// Export the client instance with the name that might be used elsewhere
export const client = prismaClient;
export default prismaClient;

// Also re-export types for convenience
export * from "./generated/prisma/client";
