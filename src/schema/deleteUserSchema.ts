import { z } from "zod";

export const deleteUserSchema = z.object({
    walletAddress: z.string({error:"Invalid wallet address"}).min(42).max(42),
    message: z.string({error:"Message is required"}),
    signature: z.string({error:"Signature is required"}),
    timestamp: z.number({error:"Timestamp is required"}),
});