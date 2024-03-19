import userRelationshipController from "../controllers/user-relationship-controller";
import { Router } from "express";
import { requireAuth } from "../middlewares/auth";

export const userRelationshipRoute = Router();

userRelationshipRoute.post(
  "/friend/send",
  requireAuth,
  userRelationshipController.createFriendRequestRelationship
);

userRelationshipRoute.put(
  "/friend/accept",
  requireAuth,
  userRelationshipController.createFriendRelationship
);

userRelationshipRoute.put(
  "/friend/decline",
  requireAuth,
  userRelationshipController.deleteFriendRequestRelationship
);
