import friendController from "../controllers/friend-controller";
import { Router } from "express";
import { requireAuth } from "../middlewares/auth";

export const friendRoute = Router();

friendRoute.get(
  "/friends/search",
  requireAuth,
  friendController.getFriendsWithPagination
);
