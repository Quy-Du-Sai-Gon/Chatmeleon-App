import prisma from "../libs/prismadb";
import { Request, Response } from "express";

/**
 * Whether the conversation exists and the user is a member of it.
 */
const hasConversation = async (
  userId: string,
  conversationId: string
): Promise<boolean> =>
  (await prisma.conversation.count({
    where: { id: conversationId, userIds: { has: userId } },
  })) > 0;

const getAllMessagesByConversationIdWithPagination = async (
  req: Request,
  res: Response
) => {
  const conversationId = req.query.conversationId as string;
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
  const cursor = req.query.cursor as string | undefined;

  if (!(await hasConversation(req.auth!.userId, conversationId))) {
    return res
      .status(403)
      .type("text/plain")
      .send(
        "Forbidden: User not allowed to retrieve the messages of the conversation."
      );
  }

  const allMessages = await prisma.message.findMany({
    where: {
      conversation: {
        id: conversationId,
      },
      id: {
        gt: cursor,
      },
    },
    take: pageSize,
  });

  const lastMessage = allMessages[allMessages.length - 1];
  const nextCursor = lastMessage ? lastMessage.id : null;

  res.json({
    allMessages,
    nextCursor,
  });
};

// Fetch messages for the authorized user with pagination
const getAllMessagesByUserId = async (req: Request, res: Response) => {
  const { userId } = req.auth!; // Get authenticated user's ID
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10; // Get desired page size from query parameters
  const cursor = req.query.cursor as string | undefined; // Get optional cursor for pagination from query parameters

  const messages = await prisma.message.findMany({
    where: {
      sender: {
        id: userId, // Filter messages sent by the authenticated user
      },
      id: {
        gt: cursor, // Retrieve messages after the provided cursor (if any)
      },
    },
    take: pageSize, // Limit results to the specified page size
  });

  // Extract the last message's cursor for pagination.
  const lastMessage = messages[messages.length - 1];
  const nextCursor = lastMessage ? lastMessage.id : null;

  res.json({
    messages, // Send the fetched messages in the response
    nextCursor, // Include the cursor for further pagination
  });
};

const createMessage = async (req: Request, res: Response) => {
  const { body, image, conversationId } = req.body;
  const { userId: senderId } = req.auth!;

  if (!(await hasConversation(senderId, conversationId))) {
    return res
      .status(404)
      .type("text/plain")
      .send("Not Found - Conversation not found.");
  }

  await prisma.message.create({
    data: {
      body,
      image,
      conversation: {
        connect: {
          id: conversationId,
        },
      },
      sender: {
        connect: {
          id: senderId,
        },
      },
    },
  });

  res.sendStatus(200);
};

export default {
  getAllMessagesByConversationIdWithPagination,
  getAllMessagesByUserId,
  createMessage,
};
