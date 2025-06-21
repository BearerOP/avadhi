import { Router } from "express";
import { prismaClient } from "store/client";
const usersRouter = Router();

// usersRouter.post("/", (req, res) => {
//   const { name, email, password } = req.body;

//   const user = await prismaClient.user.create({
//     data: { name, email, password },
//   });

//   res.status(201).json({
//     message: "User created successfully",
//     data: user,
//   });
// });

export default usersRouter;