import { Request, Response } from "express";
import prisma from "../../libs/prismadb";
import { ObjectIdString, OptionalObjectIdString } from "../../validation";
import { pruneObject } from "../../validation/utils";
import { z } from "zod";

// Fetch conversations for the authorized user with pagination
const get = async (req: Request, res: Response) => {
  const { userId } = req.auth!; // Get authenticated user's ID
  const pageSize = parseInt(req.query.pageSize as any, 10) || 10; // Get desired page size from query parameters
  const cursor = OptionalObjectIdString.parse(req.query.cursor); // Get optional cursor for pagination from query parameters

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

  // Ensure the response type is specification-compliant
  type ResponseType = Array<{
    id: string;
    lastMessageId: string;
    name?: string;
    groupAvatar?: string;
    isGroup: boolean;
  }>;

  const response = conversations.map(pruneObject);

  res.json(response satisfies ResponseType); // Send the fetched conversations in the response
};

const postRequestBody = z.object({
  relatedUserId: ObjectIdString,
  body: z.string().optional(),
  image: z.string().url().optional(),
});

// Handler for creating a new original conversation with initial messages
const post = async (req: Request, res: Response) => {
  // Extract data from request body and authentication
  const { relatedUserId, body, image } = postRequestBody.parse(req.body);
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

          /**
           * Ideally, this field is never null since a conversation is always created along
           * with the first message.
           * We use a temporary value here as this will be updated to the first message later.
           */
          lastMessageId: "000000000000000000000000",
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

    type ResponseType = {
      conversationId: string;
      messageId: string;
      createdAt: Date;
    };

    return res.json(conversationAndMessageInfo satisfies ResponseType);
  } catch (error) {
    // Log the error and send a 403 Unauthorized response
    console.error("Transaction failed:", error);

    return res
      .status(403)
      .type("text/plain")
      .send("Unauthorized: User is unauthorized");
  }
};

const conversations = { get, post };

export default conversations;
