import { Router } from "express";
import usersRouter from "./users";
import websitesRouter from "./websites";


const v1Router = Router();

v1Router.use("/user", usersRouter);
v1Router.use("/website", websitesRouter);

export default v1Router;