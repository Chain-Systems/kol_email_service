import express from "express";
import "dotenv/config";
import { connectDb } from "./database/client";
import userRouter from "./routes/userRouter";

const app = express();

app.use(express.json());
app.use("/api/user", userRouter);

app.listen(3000, async () => {
  await connectDb();
  console.log("Server is running on port 3000");
});