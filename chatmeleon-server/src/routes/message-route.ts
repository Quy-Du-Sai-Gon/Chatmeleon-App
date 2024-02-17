import messageController from "../controllers/message-controller";
import { Router } from "express";
import { requireAuth } from "../middlewares/auth";

export const messageRoute = Router();

messageRoute.get(
  "/conversations/:conversationId/messages",
  requireAuth,
  messageController.getMessagesByConversationIdWithPagination
);

messageRoute.post(
  "/conversations/:conversationId/messages",
  requireAuth,
  messageController.createMessage
);
