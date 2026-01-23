import express, { type Request, type Response } from "express";
import "dotenv/config";
import { connectDb } from "./database/client";
import userRouter from "./routes/userRouter";
import { EmailService } from "./utils/emailService";
import cors from "cors";
import { cronService } from "./services/cron";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/user", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

export const emailService = new EmailService({
  service: "gmail",
  user: "fitnessfrreak2@gmail.com",
  pass: process.env.EMAIL_PASSWORD as string
});

app.listen(3000, async () => {
  await connectDb();
  await emailService.verifyConnection();
  try{
    cronService.start();
    console.log("Crons started...Sending Emails every 24hr");
  } catch (error) {
    console.error("Error starting cron service:", error);
  }
  console.log("Server is running on port 3000");
});