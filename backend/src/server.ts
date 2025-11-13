import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

//routes imports
import userRoutes from "./routes/user.routes";
import taskRoutes from "./routes/task.routes";
import { connectDb } from "./config/db";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("api is working fine");
});

//routes
app.use("/api/user", userRoutes);
app.use("/api/task", taskRoutes);

//database connection
connectDb();

const port = 5000;

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
