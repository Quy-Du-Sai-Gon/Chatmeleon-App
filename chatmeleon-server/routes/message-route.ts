import messageController from "../controllers/message-controller";
import { Router } from "express";

export const messageRoute = Router();

messageRoute.get("/messages", messageController.getAllMessages);

messageRoute.post("/messages", messageController.createMessage);

messageRoute.put("/messages/:id", messageController.updateMessage);

messageRoute.patch("/messages/:id", messageController.updateMessageFields);
