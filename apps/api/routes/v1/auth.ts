import { Request, Response, Router } from "express";
import { prismaClient } from "store/client";

const authRouter = Router();

// Google OAuth initiation
authRouter.get("/google", (req: Request, res: Response) => {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    
    if (!googleClientId) {
        return res.status(500).json({ error: "Google OAuth not configured" });
    }

    const redirectUri = `${process.env.API_BASE_URL || 'http://localhost:3001'}/api/v1/auth/google/callback`;
    const scope = "openid profile email";
    const state = Math.random().toString(36).substring(2, 15);
    
    // Store state in session/cache for validation (in production, use Redis or secure session storage)
    req.session = req.session || {};
    req.session.oauthState = state;

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${googleClientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent(scope)}&` +
        `state=${state}`;

    res.json({ 
        authUrl: googleAuthUrl,
        message: "Redirect user to this URL for Google authentication" 
    });
});

// Google OAuth callback
authRouter.get("/google/callback", async (req: Request, res: Response) => {
    try {
        const { code, state } = req.query;

        if (!code) {
            return res.status(400).json({ error: "Authorization code not provided" });
        }

        // Validate state (in production, verify against stored state)
        if (!state || state !== req.session?.oauthState) {
            return res.status(400).json({ error: "Invalid state parameter" });
        }

        // Exchange code for access token
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                code: code as string,
                grant_type: "authorization_code",
                redirect_uri: `${process.env.API_BASE_URL || 'http://localhost:3001'}/api/v1/auth/google/callback`,
            }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            return res.status(400).json({ error: "Failed to exchange code for token", details: tokenData });
        }

        // Get user info from Google
        const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        });

        const userData = await userResponse.json();

        if (!userResponse.ok) {
            return res.status(400).json({ error: "Failed to fetch user data", details: userData });
        }

        // Create or update user in database
        let user = await prismaClient.user.findUnique({
            where: { email: userData.email },
        });

        if (!user) {
            user = await prismaClient.user.create({
                data: {
                    email: userData.email,
                    name: userData.name,
                    image: userData.picture,
                },
            });
        } else {
            user = await prismaClient.user.update({
                where: { id: user.id },
                data: {
                    name: userData.name,
                    image: userData.picture,
                },
            });
        }

        // Clear OAuth state
        if (req.session) {
            delete req.session.oauthState;
        }

        res.json({ 
            success: true, 
            user: { 
                id: user.id, 
                email: user.email, 
                name: user.name, 
                image: user.image 
            },
            message: "Google authentication successful" 
        });
    } catch (error) {
        console.error("Google OAuth callback error:", error);
        res.status(500).json({ error: "Internal server error during Google authentication" });
    }
});

// GitHub OAuth initiation
authRouter.get("/github", (req: Request, res: Response) => {
    const githubClientId = process.env.GITHUB_CLIENT_ID;
    
    if (!githubClientId) {
        return res.status(500).json({ error: "GitHub OAuth not configured" });
    }

    const redirectUri = `${process.env.API_BASE_URL || 'http://localhost:3001'}/api/v1/auth/github/callback`;
    const scope = "user:email";
    const state = Math.random().toString(36).substring(2, 15);
    
    // Store state in session/cache for validation
    req.session = req.session || {};
    req.session.oauthState = state;

    const githubAuthUrl = `https://github.com/login/oauth/authorize?` +
        `client_id=${githubClientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `state=${state}`;

    res.json({ 
        authUrl: githubAuthUrl,
        message: "Redirect user to this URL for GitHub authentication" 
    });
});

// GitHub OAuth callback
authRouter.get("/github/callback", async (req: Request, res: Response) => {
    try {
        const { code, state } = req.query;

        if (!code) {
            return res.status(400).json({ error: "Authorization code not provided" });
        }

        // Validate state
        if (!state || state !== req.session?.oauthState) {
            return res.status(400).json({ error: "Invalid state parameter" });
        }

        // Exchange code for access token
        const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: process.env.GITHUB_CLIENT_ID!,
                client_secret: process.env.GITHUB_CLIENT_SECRET!,
                code: code as string,
            }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok || tokenData.error) {
            return res.status(400).json({ error: "Failed to exchange code for token", details: tokenData });
        }

        // Get user info from GitHub
        const userResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
                "User-Agent": "Avadhi-App",
            },
        });

        const userData = await userResponse.json();

        if (!userResponse.ok) {
            return res.status(400).json({ error: "Failed to fetch user data", details: userData });
        }

        // Get user email from GitHub (might be private)
        let userEmail = userData.email;
        if (!userEmail) {
            const emailResponse = await fetch("https://api.github.com/user/emails", {
                headers: {
                    Authorization: `Bearer ${tokenData.access_token}`,
                    "User-Agent": "Avadhi-App",
                },
            });
            
            if (emailResponse.ok) {
                const emails = await emailResponse.json();
                const primaryEmail = emails.find((email: any) => email.primary);
                userEmail = primaryEmail?.email || emails[0]?.email;
            }
        }

        if (!userEmail) {
            return res.status(400).json({ error: "Unable to retrieve user email from GitHub" });
        }

        // Create or update user in database
        let user = await prismaClient.user.findUnique({
            where: { email: userEmail },
        });

        if (!user) {
            user = await prismaClient.user.create({
                data: {
                    email: userEmail,
                    name: userData.name || userData.login,
                    image: userData.avatar_url,
                },
            });
        } else {
            user = await prismaClient.user.update({
                where: { id: user.id },
                data: {
                    name: userData.name || userData.login,
                    image: userData.avatar_url,
                },
            });
        }

        // Clear OAuth state
        if (req.session) {
            delete req.session.oauthState;
        }

        res.json({ 
            success: true, 
            user: { 
                id: user.id, 
                email: user.email, 
                name: user.name, 
                image: user.image 
            },
            message: "GitHub authentication successful" 
        });
    } catch (error) {
        console.error("GitHub OAuth callback error:", error);
        res.status(500).json({ error: "Internal server error during GitHub authentication" });
    }
});

// Logout route
authRouter.post("/logout", (req: Request, res: Response) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: "Failed to logout" });
            }
            res.json({ success: true, message: "Logged out successfully" });
        });
    } else {
        res.json({ success: true, message: "No active session" });
    }
});

export default authRouter;