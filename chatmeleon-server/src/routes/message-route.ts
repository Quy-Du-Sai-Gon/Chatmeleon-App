import messageController from "../controllers/message-controller";
import { Router } from "express";
import { requireAuth } from "../middlewares/auth";

export const messageRoute = Router();

messageRoute.get(
  "/conversations/:conversationId/messages",
  requireAuth,
  messageController.getAllMessagesByConversationIdWithPagination
);

messageRoute.post("/messages", requireAuth, messageController.createMessage);
