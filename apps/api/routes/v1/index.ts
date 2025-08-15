import { Router } from "express";
import usersRouter from "./users";
import websitesRouter from "./websites";
import profileRouter from "./profile";
import authRouter from "./auth";
import notifyRouter from "./notify";


const v1Router = Router();

// Test endpoint to verify API connectivity
v1Router.get("/test", (req, res) => {
  res.json({ 
    success: true, 
    message: "API is working!", 
    timestamp: new Date().toISOString(),
    cors: "enabled"
  });
});

v1Router.use("/user", usersRouter);
v1Router.use("/website", websitesRouter);
v1Router.use("/profile", profileRouter);
v1Router.use("/auth", authRouter);
v1Router.use("/notify", notifyRouter);
    

export default v1Router;