import { prismaClient } from "../database/client";
import { createUserSchema } from "../schema/createUserSchema";
import type { Request, Response } from "express";
import { sendVerificationEmail } from "../utils/email";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default{
    createUser:async (req: Request, res: Response) => {
        const { error } = createUserSchema.safeParse(req.body);
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        const { email, walletAddress } = req.body;
        try {
            const user = await prismaClient.user.create({
                data: { email, walletAddress }
            });
            await sendVerificationEmail(user.email, user.id);
            return res.status(201).json({ message: "User created successfully", user });
        } catch (error) {
            console.error("Failed to create user:", error);
            return res.status(500).json({ error: "Failed to create user" });
        }
    },
    verifyEmail: async (req: Request, res: Response) => {
        const userId = req.params.userId as string;
        if(!userId || userId.length !== 36) {
            return res.status(400).sendFile(path.join(__dirname, "../view/error.html"));
        }
        try {
            await prismaClient.user.update({
                where: { id: userId },
                data: { verified: true }
            });
            return res.status(200).sendFile(path.join(__dirname, "../view/verified.html"));
        } catch (error) {
            console.error("Failed to verify email:", error);
            return res.status(500).sendFile(path.join(__dirname, "../view/error.html"));
        }
    }

}