import { Router, type RequestHandler } from "express";
import { prismaClient } from "store/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { auth } from "../../middlewares/user";

const usersRouter = Router();

const registerHandler: RequestHandler = async (req, res) => {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prismaClient.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginHandler: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);

    res.status(200).json({
      message: "Login successful",
      data: { token },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const meHandler: RequestHandler = async (req, res) => {
  try {
    const userId = req.userId as string;

    if (!userId) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Me handler error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

usersRouter.post("/auth/register", registerHandler);

usersRouter.post("/auth/login", loginHandler);

usersRouter.get("/", auth, meHandler);

export default usersRouter;
