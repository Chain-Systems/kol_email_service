import express from "express";
import "dotenv/config";
import { connectDb } from "./database/client";
import userRouter from "./routes/userRouter";
import { EmailService } from "./utils/emailService";



const app = express();

app.use(express.json());
app.use("/api/user", userRouter);

export const emailService = new EmailService({
  service: "gmail",
  user: "fitnessfrreak2@gmail.com",
  pass: process.env.EMAIL_PASSWORD as string
});

app.listen(3000, async () => {
  await connectDb();
  await emailService.verifyConnection();
  console.log("Server is running on port 3000");
});