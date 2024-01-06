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

  // Send success response
  res.sendStatus(200);
};

// Controller for creating a new original conversation with initial messages
const createOriginalConversationAndFirstMessages = async (
  req: Request,
  res: Response
) => {
  // Extract data from request body and authentication
  const { userIds, body, image } = req.body;
  const { userId: senderId } = req.auth!;

  // Create the conversation in the database
  const newConversation = await prisma.conversation.create({
    data: {
      userIds: [senderId, userIds], // Combine sender and recipients
      isGroup: false, // One-on-one conversation
      original: true, // Mark as "original" conversation
    },
  });

  // Create initial messages for the conversation
  const createdMessage = await prisma.message.create({
    data: {
      body, // Message content
      image, // Optional image URL
      conversation: {
        connect: {
          id: newConversation.id, // Link to the created conversation
        },
      },
      sender: {
        connect: {
          id: senderId, // Associate with the sender
        },
      },
    },
  });

  // Update conversation metadata
  await prisma.conversation.update({
    where: { id: newConversation.id },
    data: {
      messagesIds: {
        push: createdMessage.id, // Add message ID to the array
      },
      lastMessageAt: createdMessage.createdAt, // Set last message timestamp
    },
  });

  // Send success response
  res.sendStatus(200);
};

export default {
  getAllMessagesByConversationIdWithPagination,
  getAllMessagesByUserId,
  createOriginalConversationAndFirstMessages,
  createMessage,
};
