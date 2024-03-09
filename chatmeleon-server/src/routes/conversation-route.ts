import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import conversations from "../controllers/conversations";
import conversationWithId from "../controllers/conversations/[conversationId]";

export const conversationRoute = Router();

conversationRoute.get(
  "/conversations/:conversationId",
  requireAuth,
  conversationWithId.get
);

conversationRoute.get("/conversations", requireAuth, conversations.get);
conversationRoute.post("/conversations", requireAuth, conversations.post);
