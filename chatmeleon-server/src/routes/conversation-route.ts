import conversationControler from "../controllers/conversation-controller";
import { Router } from "express";
import { requireAuth } from "../middlewares/auth";

export const conversationRoute = Router();

conversationRoute.get(
  "/conversations/:conversationId",
  requireAuth,
  conversationControler.getConversationById
);

conversationRoute.get(
  "/conversations",
  requireAuth,
  conversationControler.getConversationsByUserIdWithPagination
);

conversationRoute.post(
  "/conversations",
  requireAuth,
  conversationControler.createOriginalConversationAndFirstMessages
);
