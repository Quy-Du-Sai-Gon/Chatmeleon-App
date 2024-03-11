import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import messagesWithConversationId from "../controllers/conversations/[conversationId]/messages";

export const messageRoute = Router();

messageRoute.get(
  "/conversations/:conversationId/messages",
  requireAuth,
  messagesWithConversationId.get
);

messageRoute.post(
  "/conversations/:conversationId/messages",
  requireAuth,
  messagesWithConversationId.post
);
