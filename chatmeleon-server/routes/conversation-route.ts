import conversationControler from "../controllers/conversation-controller.js"
import { Router } from 'express';

export const conversationRoute = Router();

conversationRoute.get('/conversations/:id', conversationControler.getConversationById);
conversationRoute.get('/conversations', conversationControler.getAllConversations);
conversationRoute.post('/conversations', conversationControler.postConversation);
conversationRoute.put('/conversations/:id', conversationControler.updateConversation);
conversationRoute.patch('/conversations/:id', conversationControler.updateConversationFields);
conversationRoute.delete('/conversations/:id', conversationControler.deleteConversation);