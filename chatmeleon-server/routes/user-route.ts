import userController from "../controllers/user-controller"
import { Router } from 'express';

export const userRoute = Router();
userRoute.get('/users/:id', userController.getUserById);
userRoute.get('/users', userController.getAllUsers);
