import { prismaClient } from "../database/client";
import { createUserSchema } from "../schema/createUserSchema";
import type { Request, Response } from "express";
import { sendVerificationEmail } from "../utils/email";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ethers } from "ethers";
import { deleteUserSchema } from "../schema/deleteUserSchema";

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
            await prismaClient.$transaction(async (tx) => {
                const user = await tx.user.findUnique({ where: { id: userId } });
                if(!user) {
                    return res.status(400).sendFile(path.join(__dirname, "../view/envalidUser.html"));
                }
                if(user.verified) {
                    return res.status(400).sendFile(path.join(__dirname, "../view/envalidUser.html"));
                }
                await tx.user.update({
                    where: { id: userId },
                    data: { verified: true, updatedAt: new Date() }
                });
                await tx.user.update({
                    where: { id: userId },
                    data: { updatedAt: new Date() }
                });
            });
            return res.status(200).sendFile(path.join(__dirname, "../view/verified.html"));
        } catch (error) {
            console.error("Failed to verify email:", error);
            return res.status(500).sendFile(path.join(__dirname, "../view/error.html"));
        }
    },
    
    deleteUser: async (req: Request, res: Response) => {
        const {data, error } = deleteUserSchema.safeParse(req.body);
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        const {walletAddress,message,signature,timestamp} = data;
        const recoveredAddress = ethers.verifyMessage(message, signature);   

        if(Date.now() - timestamp > 1000 * 60 * 5) {
            return res.status(400).json({ error: "Signature expired, please try again" });
        }
        if(recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
            return res.status(400).json({ error: "Invalid signature, please try again" });
        }
        try {
            const user = await prismaClient.user.findUnique({ where: { walletAddress:walletAddress.trim() } });
            if(!user) {
                return res.status(400).json({ error: "User not found, please try again" });
            }
            await prismaClient.user.delete({ where: { id: user.id } });
            return res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            console.error("Failed to delete user:", error);
            return res.status(500).json({ error: "Failed to delete user, please try again" });
        }
    }
}