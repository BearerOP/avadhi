import express from "express";
import v1Router from "./routes/v1/index";
import 'dotenv/config';

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

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`🚀 API Server is running on http://localhost:${port}`);
  console.log(`📚 API Documentation available at http://localhost:${port}/api/v1`);
});