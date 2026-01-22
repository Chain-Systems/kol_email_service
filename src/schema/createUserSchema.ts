import { z } from "zod";

export const createUserSchema = z.object({
    email: z.email({error:"Invalid email address"}),
    walletAddress: z.string({error:"Invalid wallet address"}).min(42).max(42),
});