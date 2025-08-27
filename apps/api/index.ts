import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import v1Router from "./routes/v1/index";
import 'dotenv/config';

declare global {
    namespace Express {
      interface Request {
        userId?: string;
        user?: any; // User object from NextAuth session
      }
    }
  }

declare module 'express-session' {
  interface SessionData {
    oauthState?: string;
  }
}


const app = express();

// CORS configuration to allow frontend requests
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000','https://avadhi.pro', 'https://api.avadhi.pro'], // Allow both possible frontend ports and API subdomain
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session middleware for OAuth state management
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret-change-this-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true,
    maxAge: 1000 * 60 * 15 // 15 minutes
  }
}));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    message: "API server is running" 
  });
});

app.use("/api/v1", v1Router);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`🚀 API Server is running on http://localhost:${port}`);
  console.log(`📚 API Documentation available at http://localhost:${port}/api/v1`);
});