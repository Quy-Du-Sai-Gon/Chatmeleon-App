import conversationControler from "../controllers/conversation-controller"
import { Router } from 'express';

export const conversationRoute = Router();

conversationRoute.get('/conversations/:id', conversationControler.getConversationById);
conversationRoute.get('/conversations/users/:userId', conversationControler.getAllConversationsByUserId);

conversationRoute.post('/conversations', conversationControler.postConversation);

conversationRoute.put('/conversations/:id', conversationControler.updateConversation);

conversationRoute.patch('/conversations/:id', conversationControler.updateConversationFields);