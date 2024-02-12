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

// Controller for creating a new original conversation with initial messages
const createOriginalConversationAndFirstMessages = async (
  req: Request,
  res: Response
) => {
  // Extract data from request body and authentication
  const { relatedUserId, body, image } = req.body;
  const { userId: senderId } = req.auth!;
  // Utilize a Prisma transaction to ensure atomicity and data consistency
  try {
    const conversationAndMessageInfo = await prisma.$transaction(async (tx) => {
      // Check for existing original conversation between the two users
      const existingConversation = await tx.conversation.findFirst({
        where: {
          userIds: {
            hasEvery: [senderId, relatedUserId], // Must include both sender and recipient
          },
          isGroup: false, // Only consider original conversations
        },
      });
      if (existingConversation) {
        throw new Error("Conflicted: Original conversation already existed"); // Conversation already exists, return an error code
      }
      // Create the conversation in the database
      const newConversation = await tx.conversation.create({
        data: {
          userIds: [senderId, relatedUserId], // Combine sender and recipients
          isGroup: false, // Mark as "original" conversation
        },
      });
      // Create initial messages for the conversation
      const createdMessage = await tx.message.create({
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
      await tx.conversation.update({
        where: { id: newConversation.id },
        data: {
          messagesIds: {
            push: createdMessage.id, // Add message ID to the array
          },
          lastActive: createdMessage.createdAt, // Set last message timestamp
          lastMessageId: createdMessage.id,
        },
      });
      // Return appropriate data
      return {
        conversationId: newConversation.id,
        messageId: createdMessage.id,
        createdAt: newConversation.createdAt,
      };
    });
    return res.json(conversationAndMessageInfo);
  } catch (error) {
    // Throw the error to trigger the transaction rollback
    // Log the error and send a 403 Unauthorized response
    console.error("Transaction failed:", error);

    return res
      .status(403)
      .type("text/plain")
      .send("Unauthorized: User is unauthorized");
  }
};

export default {
  getConversationById,
  getConversationsByUserIdWithPagination,
  createOriginalConversationAndFirstMessages,
};
