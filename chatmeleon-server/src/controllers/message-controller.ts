import prisma from "../libs/prismadb";
import { Request, Response } from "express";

// Fetch messages for the conversation with pagination
const getMessagesByConversationIdWithPagination = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.auth!; // Get authenticated user's ID
  const conversationId = req.params.conversationId;
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10; // Get desired page size from query parameters
  const cursor = req.query.cursor as string | undefined; // Get optional cursor for pagination from query parameters
  try {
    const allMessages = await prisma.$transaction(async (tx) => {
      // Validate conversation existence
      await tx.conversation.findFirstOrThrow({
        where: {
          id: conversationId,
          userIds: { has: userId },
        },
      });
      const allMessages = await tx.message.findMany({
        where: {
          conversation: {
            id: conversationId, // Filter messages for the conversation
          },
        },
        orderBy: {
          createdAt: "desc", // Order messages by creation date in ascending order
        },
        take: pageSize, // Limit results to the specified page size
        ...(cursor && {
          cursor: {
            id: cursor,
          },
          skip: 1,
          select: {
            id: true,
            body: true,
            image: true,
            createdAt: true,
            seenIds: true,
            senderId: true,
            conversationId: false,
          },
        }),
      });
      return allMessages;
    });

    return res.json(allMessages); // Send the fetched messages in the response
  } catch (error) {
    // Throw the error to trigger the transaction rollback
    // Log the error and send a 403 Unauthorized response
    console.error("Transaction failed -", error);

    return res
      .status(403)
      .type("text/plain")
      .send("Unauthorized: User is unauthorized");
  }
};

// Fetch messages for the authorized user with pagination
const getMessagesByUserIdWithPagination = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.auth!; // Get authenticated user's ID
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10; // Get desired page size from query parameters
  const cursor = req.query.cursor as string | undefined; // Get optional cursor for pagination from query parameters

  const messages = await prisma.message.findMany({
    where: {
      sender: {
        id: userId, // Filter messages sent by the authenticated user
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: pageSize, // Limit results to the specified page size
    ...(cursor && {
      cursor: {
        id: cursor,
      },
      skip: 1,
    }),
  });

  res.json(messages); // Send the fetched messages in the response
};

// Function to create a new message
const createMessage = async (req: Request, res: Response) => {
  // Extract data from request body and authentication
  const { body, image, conversationId } = req.body;
  const { userId: senderId } = req.auth!;
  try {
    await prisma.$transaction(async (tx) => {
      // Validate conversation existence
      await tx.conversation.findFirstOrThrow({
        where: {
          id: conversationId,
          userIds: { has: senderId },
        },
      });
      // Create the new message within the transaction
      const newMessage = await tx.message.create({
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
      // Update conversation with new message ID and timestamp
      await tx.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          lastActive: newMessage.createdAt,
          messagesIds: { push: newMessage.id },
          lastMessageId: newMessage.id,
        },
      });
    });
  } catch (error) {
    // Throw the error to trigger the transaction rollback
    // Log the error and send a 403 Unauthorized response
    console.error("Transaction failed -", error);

    return res
      .status(403)
      .type("text/plain")
      .send("Unauthorized: User is unauthorized");
  }
  // Send success response on successful transaction
  res.status(200).type("text/plain").send("OK");
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
    await prisma.$transaction(async (tx) => {
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
    });
  } catch (error) {
    // Throw the error to trigger the transaction rollback
    // Log the error and send a 403 Unauthorized response
    console.error("Transaction failed -", error);

    return res
      .status(403)
      .type("text/plain")
      .send("Unauthorized: User is unauthorized");
  }
  // All operations successful, send a success response
  res.status(200).type("text/plain").send("OK");
};

export default {
  getMessagesByConversationIdWithPagination,
  getMessagesByUserIdWithPagination,
  createOriginalConversationAndFirstMessages,
  createMessage,
};
