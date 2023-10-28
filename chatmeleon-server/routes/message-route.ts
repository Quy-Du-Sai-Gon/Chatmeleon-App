import messageController from "../controllers/message-controller";
import { Router } from "express";

export const messageRoute = Router();

messageRoute.get(
  "/conversations/:conversationId/messages",
  messageController.getAllMessages
);

messageRoute.post("/messages", messageController.createMessage);
