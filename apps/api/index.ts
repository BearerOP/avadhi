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

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT || 3000}`);
});