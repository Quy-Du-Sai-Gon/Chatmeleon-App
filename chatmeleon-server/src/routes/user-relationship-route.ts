import userRelationshipController from "../controllers/user-relationship-controller";
import { Router } from "express";

export const userRelationshipRoute = Router();

userRelationshipRoute.post(
  "/friend/send",
  userRelationshipController.createFriendRequestRelationship
);

userRelationshipRoute.put(
  "/friend/accept",
  userRelationshipController.createFriendRelationship
);
