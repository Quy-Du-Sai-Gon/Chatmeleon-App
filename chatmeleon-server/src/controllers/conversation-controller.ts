import prisma from "../libs/prismadb";
import { Request, Response } from "express";

// Retrieve a specific conversation by ID, ensuring user authorization
const getConversationById = async (req: Request, res: Response) => {
  const { userId } = req.auth!; // Get authenticated user's ID
  const conversationId = req.params.conversationId;

  const conversation = await prisma.conversation.findUniqueOrThrow({
    where: {
      id: conversationId,
      userIds: {
        has: userId, // Check if authorized user is part of the conversation
      },
    },
  });

  res.json(conversation); // Send the retrieved conversation as JSON response
};

// Fetch conversations for the authorized user with pagination
const getConversationsWithPagination = async (req: Request, res: Response) => {
  const { userId } = req.auth!; // Get authenticated user's ID
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10; // Get desired page size from query parameters
  const cursor = req.query.cursor as string | undefined; // Get optional cursor for pagination from query parameters

  const conversations = await prisma.conversation.findMany({
    where: {
      userIds: {
        has: userId, // Filter conversations for the authorized user
      },
      id: {
        gt: cursor, // Retrieve conversations after the provided cursor (if any)
      },
    },
    orderBy: {
      lastMessageAt: "asc", // Order conversations by last message time in ascending order
    },
    take: pageSize, // Limit results to the specified page size
  });

  // Extract the last conversation's cursor for pagination.
  const lastConversation = conversations[conversations.length - 1]; // Get the last conversation for pagination
  const nextCursor = lastConversation ? lastConversation.id : null; // Prepare the cursor for the next page

  res.json({
    conversations, // Send the fetched conversations in the response
    nextCursor, // Include the cursor for further pagination
  });
};

export default {
  getConversationById,
  getConversationsWithPagination,
};
