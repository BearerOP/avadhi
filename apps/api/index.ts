import express from "express";
import dotenv from "dotenv";
import v1Router from "./routes/v1/index";
dotenv.config();

declare global {
    namespace Express {
      interface Request {
        userId?: string;
      }
    }
  }


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", v1Router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 API Server is running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api/v1`);
});