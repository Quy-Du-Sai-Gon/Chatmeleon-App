import userControler from "../controllers/user-controller.js"
import { Router } from 'express';

export const userRoute = Router();
userRoute.get('/users/:id', userControler.getUserById);
userRoute.get('/users', userControler.getAllUsers);
