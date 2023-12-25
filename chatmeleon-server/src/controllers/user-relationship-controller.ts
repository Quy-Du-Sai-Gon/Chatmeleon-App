import prisma from "../libs/prismadb";
import { Request, Response } from "express";

const createFriendRequestRelationship = async (req: Request, res: Response) => {
  const { relatingUserId, relatedUserId } = req.body;
  const relationship = await prisma.user_Relationship.createMany({
    data: [
      {
        type: "SENDING_FRIEND_REQUEST",
        relatingUserId: relatingUserId,
        relatedUserId: relatedUserId,
      },
      {
        type: "PENDING_FRIEND_REQUEST",
        relatingUserId: relatedUserId,
        relatedUserId: relatingUserId,
      },
    ],
  });

  res.json(relationship);
};

const createFriendRelationship = async (req: Request, res: Response) => {
  const { relatingUserId, relatedUserId } = req.body;

  const existingRelationship = await prisma.user_Relationship.findMany({
    where: {
      OR: [
        {
          relatingUserId: relatingUserId,
          relatedUserId: relatedUserId,
          type: "PENDING_FRIEND_REQUEST",
        },
        {
          relatingUserId: relatedUserId,
          relatedUserId: relatingUserId,
          type: "SENDING_FRIEND_REQUEST",
        },
      ],
    },
  });

  if (existingRelationship && existingRelationship.length === 2) {
    const updateRelationship = await prisma.user_Relationship.updateMany({
      where: {
        OR: [
          {
            relatingUserId: relatingUserId,
            relatedUserId: relatedUserId,
            type: "PENDING_FRIEND_REQUEST",
          },
          {
            relatingUserId: relatedUserId,
            relatedUserId: relatingUserId,
            type: "SENDING_FRIEND_REQUEST",
          },
        ],
      },
      data: {
        type: "FRIEND",
      },
    });

    res.status(200).json({
      message: "Friend relationship created successfully",
      data: updateRelationship,
    });
  } else {
    res.status(404).json({ message: "No pending friend request found" });
  }
};

const deleteFriendRequestRelationship = async (req: Request, res: Response) => {
  const { relatingUserId, relatedUserId } = req.body;

  const existingRelationship = await prisma.user_Relationship.findMany({
    where: {
      OR: [
        {
          relatingUserId: relatingUserId,
          relatedUserId: relatedUserId,
          type: "PENDING_FRIEND_REQUEST",
        },
        {
          relatingUserId: relatedUserId,
          relatedUserId: relatingUserId,
          type: "SENDING_FRIEND_REQUEST",
        },
      ],
    },
  });

  if (existingRelationship && existingRelationship.length === 2) {
    const updateRelationship = await prisma.user_Relationship.deleteMany({
      where: {
        OR: [
          {
            relatingUserId: relatingUserId,
            relatedUserId: relatedUserId,
            type: "PENDING_FRIEND_REQUEST",
          },
          {
            relatingUserId: relatedUserId,
            relatedUserId: relatingUserId,
            type: "SENDING_FRIEND_REQUEST",
          },
        ],
      },
    });

    res.status(200).json({
      message: "Friend request relationship deleted successfully",
      data: updateRelationship,
    });
  } else {
    res.status(404).json({ message: "No pending friend request found" });
  }
};

export default {
  createFriendRequestRelationship,
  createFriendRelationship,
  deleteFriendRequestRelationship,
};
