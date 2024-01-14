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

  prisma
    .$transaction(async (tx) => {
      try {
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
            id: {
              gt: cursor, // Retrieve conversations after the provided cursor (if any)
            },
          },
          orderBy: {
            createdAt: "asc", // Order messages by creation date in ascending order
          },
          take: pageSize, // Limit results to the specified page size
        });

        // Extract the last messages's cursor for pagination.
        const lastMessage = allMessages[allMessages.length - 1];
        const nextCursor = lastMessage ? lastMessage.id : null;

        return res.json({
          allMessages, // Send the fetched messages in the response
          nextCursor, // Include the cursor for further pagination
        });
      } catch (error) {
        // Rethrow the error to trigger the transaction rollback
        throw error;
      }
    })
    .catch((error) => {
      // Log the error and send a 403 Unauthorized response
      console.error("Transaction failed:", error);
      res
        .status(403)
        .type("text/plain")
        .send("Unauthorized: User is unauthorized");
    });
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
      id: {
        gt: cursor, // Retrieve messages after the provided cursor (if any)
      },
    },
    orderBy: {
      createdAt: "asc",
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

// Function to create a new message
const createMessage = async (req: Request, res: Response) => {
  // Extract data from request body and authentication
  const { body, image, conversationId } = req.body;
  const { userId: senderId } = req.auth!;

  prisma
    .$transaction(async (tx) => {
      try {
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
            lastMessageAt: newMessage.createdAt,
            lastMessage: newMessage.body,
            messagesIds: { push: newMessage.id },
          },
        });

        // Send success response on successful transaction
        return res.status(200).type("text/plain").send("OK");
      } catch (error) {
        // Rethrow the error to trigger the transaction rollback
        throw error;
      }
    })
    .catch((error) => {
      // Log the error and send a 403 Unauthorized response
      console.error("Transaction failed:", error);
      res
        .status(403)
        .type("text/plain")
        .send("Unauthorized: User is unauthorized");
    });
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
  prisma
    .$transaction(async (tx) => {
      try {
        // Check for existing original conversation between the two users
        const existingConversation = await tx.conversation.findFirst({
          where: {
            userIds: {
              hasEvery: [senderId, relatedUserId], // Must include both sender and recipient
            },
            isOriginal: true, // Only consider original conversations
          },
        });

        if (existingConversation) {
          // Conversation already exists, return an error code
          return res
            .status(409)
            .type("text/plain")
            .send("Conflicted: Original conversation already existed");
        }

        // Create the conversation in the database
        const newConversation = await tx.conversation.create({
          data: {
            userIds: [senderId, relatedUserId], // Combine sender and recipients
            isOriginal: true, // Mark as "original" conversation
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
            lastMessageAt: createdMessage.createdAt, // Set last message timestamp
            lastMessage: createdMessage.body,
          },
        });

        // All operations successful, send a success response
        return res.status(200).type("text/plain").send("OK");
      } catch (error) {
        // Rethrow the error to trigger the transaction rollback
        throw error;
      }
    })
    .catch((error) => {
      // Log the error and send a 403 Unauthorized response
      console.error("Transaction failed:", error);
      res
        .status(403)
        .type("text/plain")
        .send("Unauthorized: User is unauthorized");
    });
};

export default {
  getMessagesByConversationIdWithPagination,
  getMessagesByUserIdWithPagination,
  createOriginalConversationAndFirstMessages,
  createMessage,
};
