import prisma from "../libs/prismadb";
import { Request, Response } from "express";

const createFriendRequestRelationship = async (req: Request, res: Response) => {
  const { relatingUserId, relatedUserId } = req.body;
  const relationship = await prisma.user_Relationship.createMany({
    data: [
      {
        type: "sending_friend_request",
        relatingUserId: relatingUserId,
        relatedUserId: relatedUserId,
      },
      {
        type: "pending_friend_request",
        relatingUserId: relatedUserId,
        relatedUserId: relatingUserId,
      },
    ],
  });

  res.json(relationship);
};
