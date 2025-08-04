import { Router } from "express";
import { nextAuthSessionAuth } from "../../middlewares/nextauth";

const profileRouter = Router();

// Get current user profile (protected route)
profileRouter.get("/me", nextAuthSessionAuth, async (req, res) => {
    try {
        res.json({
            success: true,
            user: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                image: req.user.image,
                provider: req.user.provider,
                createdAt: req.user.createdAt,
                updatedAt: req.user.updatedAt
            }
        });
    } catch (error) {
        console.error("Profile fetch error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch profile"
        });
    }
});

// Update user profile (protected route)
profileRouter.patch("/me", nextAuthSessionAuth, async (req, res) => {
    try {
        const { name } = req.body;
        
        // Basic validation
        if (!name || typeof name !== 'string') {
            res.status(400).json({
                success: false,
                message: "Name is required and must be a string"
            });
            return;
        }

        // In a real app, you would update the user in the database
        res.json({
            success: true,
            message: "Profile updated successfully",
            user: {
                ...req.user,
                name
            }
        });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update profile"
        });
    }
});

export default profileRouter;