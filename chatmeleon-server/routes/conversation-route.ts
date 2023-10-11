import conversationControler from "../controllers/conversation-controller.js"
import { Router } from 'express';

export const conversationRoute = Router();
// conversationRoute.get('/conversations/:id', conversationControler.getUserById);
conversationRoute.get('/conversations', conversationControler.getAllConverstations);
