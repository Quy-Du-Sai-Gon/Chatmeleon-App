import messageController from "../controllers/message-controller.js";
import { Router } from 'express';

export const messageRoute = Router();
messageRoute.get('/messages/:id', messageController.getMessageById);
messageRoute.get('/messages', messageController.getAllMessages);