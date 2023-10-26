import conversationControler from "../controllers/conversation-controller";
import { Router } from "express";

export const conversationRoute = Router();

conversationRoute.get(
  "/conversations/:id",
  conversationControler.getConversationById
);
conversationRoute.get(
  "/users/:userId/conversations",
  conversationControler.getAllConversationsByUserId
);

conversationRoute.post(
  "/conversations",
  conversationControler.postConversation
);
