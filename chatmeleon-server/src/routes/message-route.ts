import messageController from "../controllers/message-controller";
import { Router } from "express";

export const messageRoute = Router();

messageRoute.get(
  "/conversations/:conversationId/messages",
  messageController.getAllMessagesByConversationIdWithPagination
);

messageRoute.get(
  "/users/:userId/messages",
  messageController.getAllMessagesByUserId
);

messageRoute.post("/messages", messageController.createMessage);
