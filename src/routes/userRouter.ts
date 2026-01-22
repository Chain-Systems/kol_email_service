import { Router } from "express";
import userController from "../controller/userController";

const userRouter: Router = Router();

userRouter.post("/register", userController.createUser);

export default userRouter;