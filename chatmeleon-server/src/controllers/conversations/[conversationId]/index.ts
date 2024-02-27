import { Request, Response } from "express";
import prisma from "../../../libs/prismadb";

// Retrieve a specific conversation by ID, ensuring user authorization
const get = async (req: Request, res: Response) => {
  const { userId } = req.auth!; // Get authenticated user's ID
  const conversationId = req.params.conversationId;

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
      userIds: {
        has: userId, // Check if authorized user is part of the conversation
      },
    },
    select: {
      id: false,
      createdAt: true,
      name: true,
      lastActive: true,
      lastMessageId: true,
      isGroup: true,
      groupAvatar: true,
      nicknames: true,
      userIds: true,
    },
  });
  if (!conversation) {
    return res
      .status(403)
      .type("text/plain")
      .send("Unauthorized: User is unauthorized");
  }

  res.json(conversation); // Send the retrieved conversation as JSON response
};

const conversationWithId = { get };

export default conversationWithId;
