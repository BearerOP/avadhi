import { PrismaClient } from "./generated/prisma"
import dotenv from 'dotenv';
dotenv.config();

// Set default DATABASE_URL if not provided
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://myuser:mypassword@localhost:5433/avadhi?schema=public';
  console.log('Using default DATABASE_URL for local development');
}

console.log('DATABASE_URL:', process.env.DATABASE_URL);

export const prismaClient = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});

// Export the client instance with the name that might be used elsewhere
export const client = prismaClient;
export default prismaClient;

// Also re-export types for convenience
export * from "./generated/prisma/client";
