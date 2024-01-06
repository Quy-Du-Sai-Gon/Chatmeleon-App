import messageController from "../controllers/message-controller";
import { Router } from "express";
import { requireAuth } from "../middlewares/auth";

export const messageRoute = Router();

messageRoute.get(
  "/conversations/:conversationId/messages",
  requireAuth,
  messageController.getMessagesByConversationIdWithPagination
);

messageRoute.get(
  "/user/messages",
  requireAuth,
  messageController.getMessagesByUserIdWithPagination
);

messageRoute.post(
  "/conversations",
  requireAuth,
  messageController.createOriginalConversationAndFirstMessages
);

messageRoute.post("/messages", requireAuth, messageController.createMessage);
