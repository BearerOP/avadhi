-- Database initialization script
-- This runs when the PostgreSQL container starts for the first time

-- Create the database if it doesn't exist
SELECT 'CREATE DATABASE avadhi'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'avadhi');

-- Connect to the avadhi database
\c avadhi;

-- The Prisma migrations will handle the rest of the schema creation
