import prisma from "../libs/prismadb";
import { Request, Response } from "express";

// Retrieve a specific conversation by ID, ensuring user authorization
const getConversationById = async (req: Request, res: Response) => {
  const { userId } = req.auth!; // Get authenticated user's ID
  const conversationId = req.params.conversationId;

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
      userIds: {
        has: userId, // Check if authorized user is part of the conversation
      },
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

// Fetch conversations for the authorized user with pagination
const getConversationsByUserIdWithPagination = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.auth!; // Get authenticated user's ID
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10; // Get desired page size from query parameters
  const cursor = req.query.cursor as string | undefined; // Get optional cursor for pagination from query parameters

  const conversations = await prisma.conversation.findMany({
    where: {
      userIds: {
        has: userId, // Filter conversations for the authorized user
      },
    },
    orderBy: {
      lastActive: "desc",
    },
    take: pageSize, // Limit results to the specified page size
    ...(cursor && {
      cursor: {
        id: cursor,
      },
      skip: 1,
    }),
    select: {
      id: true,
      createdAt: false,
      lastMessageId: true,
      name: true,
      groupAvatar: true,
      isGroup: true,
      messagesIds: false,
      userIds: false,
    },
  });

  res.json(conversations); // Send the fetched conversations in the response
};

export default {
  getConversationById,
  getConversationsByUserIdWithPagination,
};
