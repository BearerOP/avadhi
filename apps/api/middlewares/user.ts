import type { RequestHandler } from "express";
import { prismaClient } from "store/client";
import jwt from "jsonwebtoken";

export const auth: RequestHandler = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization as string;

        if (!authorization) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        console.log(authorization);
        

        const token = authorization.split(" ")[1] || "";
        

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as unknown as {
            userId: string;
        };

        const user = await prismaClient.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        req.userId = user.id;

        next();
    } catch (error) {
        console.error("Auth error:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};
