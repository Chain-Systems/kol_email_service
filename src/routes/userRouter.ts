import { Router } from "express";
import userController from "../controller/userController";

const userRouter: Router = Router();

userRouter.post("/register", userController.createUser);
userRouter.get("/verify-email/:userId", userController.verifyEmail);

export default userRouter;