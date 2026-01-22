import express from "express";
import prisma from "./database/client";
import "dotenv/config";

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.listen(3000, async () => {
  await prisma.$connect();
  console.log("Server is running on port 3000");
});