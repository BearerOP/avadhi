import type { RequestHandler } from "express";
import { prismaClient } from "store/client";

export const nextAuthSessionAuth: RequestHandler = async (req, res, next) => {
    try {
        // Get session token from cookie or authorization header
        const sessionToken = req.headers.authorization?.replace('Bearer ', '') ||
                            req.cookies?.['next-auth.session-token'] ||
                            req.cookies?.['__Secure-next-auth.session-token'];

        if (!sessionToken) {
            res.status(401).json({ message: "No session token provided" });
            return;
        }

        // Find session in database
        const session = await prismaClient.session.findUnique({
            where: { sessionToken },
            include: { user: true }
        });

        if (!session) {
            res.status(401).json({ message: "Invalid session" });
            return;
        }

        // Check if session is expired
        if (session.expires < new Date()) {
            res.status(401).json({ message: "Session expired" });
            return;
        }

        // Attach user info to request
        req.userId = session.user.id;
        req.user = session.user;

        next();
    } catch (error) {
        console.error("NextAuth session validation error:", error);
        res.status(401).json({ message: "Session validation failed" });
    }
};

// Alternative: JWT-based validation for NextAuth JWT sessions
export const nextAuthJWTAuth: RequestHandler = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '') ||
                     req.cookies?.['next-auth.session-token'] ||
                     req.cookies?.['__Secure-next-auth.session-token'];

        if (!token) {
            res.status(401).json({ message: "No token provided" });
            return;
        }

        // For JWT strategy, you would decode and verify the NextAuth JWT here
        // This requires the NEXTAUTH_SECRET from your frontend
        // For now, we'll use the database session approach above
        
        res.status(501).json({ message: "JWT validation not implemented, use database sessions" });
    } catch (error) {
        console.error("NextAuth JWT validation error:", error);
        res.status(401).json({ message: "Token validation failed" });
    }
};