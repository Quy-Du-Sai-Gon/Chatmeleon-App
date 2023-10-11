import conversationControler from "../controllers/conversation-controller.js"
import { Router } from 'express';

export const conversationRoute = Router();
conversationRoute.get('/conversations/:id', conversationControler.getConversationById);
conversationRoute.get('/conversations', conversationControler.getAllConversations);
