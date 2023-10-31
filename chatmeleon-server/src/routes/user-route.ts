import userController from "../controllers/user-controller";
import { Router } from "express";

export const userRoute = Router();

userRoute.get("/users/:userId", userController.getUserById);
