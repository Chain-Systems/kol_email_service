import { prismaClient } from "../database/client";
import { createUserSchema } from "../schema/createUserSchema";
import type { Request, Response } from "express";

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
            return res.status(201).json({ message: "User created successfully", user });
        } catch (error) {
            console.error("Failed to create user:", error);
            return res.status(500).json({ error: "Failed to create user" });
        }
    }
}