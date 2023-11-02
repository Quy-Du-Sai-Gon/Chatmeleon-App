import conversationControler from "../controllers/conversation-controller";
import { Router } from "express";

export const conversationRoute = Router();

conversationRoute.get(
  "/conversations/:conversationId",
  conversationControler.getConversationById
);
conversationRoute.get(
  "/users/:userId/conversations",
  conversationControler.getConversationsByUserIdWithPagination
);

conversationRoute.post(
  "/conversations",
  conversationControler.createConversation
);
