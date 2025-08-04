import { Router } from "express";
import usersRouter from "./users";
import websitesRouter from "./websites";
import profileRouter from "./profile";


const v1Router = Router();

v1Router.use("/user", usersRouter);
v1Router.use("/website", websitesRouter);
v1Router.use("/profile", profileRouter);
    

export default v1Router;