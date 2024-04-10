import prisma from "@/libs/prismadb";
import { Request, Response } from "express";
import { ObjectIdString, OptionalObjectIdString } from "@/validation";
import { prunedObject } from "@/validation/utils";
import { z } from "zod";
import { io } from "@/libs/socket.io";
import { getActiveSocketId } from "@/utils";

// Fetch messages for the conversation with pagination
const get = async (req: Request, res: Response) => {
  const { userId } = req.auth!; // Get authenticated user's ID

  const conversationId = ObjectIdString.parse(req.params.conversationId);
  const pageSize = parseInt(req.query.pageSize as any, 10) || 10; // Get desired page size from query parameters
  const cursor = OptionalObjectIdString.parse(req.query.cursor); // Get optional cursor for pagination from query parameters

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
        }),
        select: {
          id: true,
          body: true,
          image: true,
          createdAt: true,
          seenIds: true,
          conversationId: false,
          senderId: true,
        },
      });

      return allMessages;
    });

    type ResponseType = Array<{
      id: string;
      body?: string;
      image?: string;
      createdAt: Date;
      seenIds: string[];
      senderId: string;
    }>;

    const response = allMessages.map(prunedObject);

    return res.json(response satisfies ResponseType); // Send the fetched messages in the response
  } catch (error) {
    // Log the error and send a 403 Unauthorized response
    console.error("Transaction failed:", error);

    return res
      .status(403)
      .type("text/plain")
      .send("Unauthorized: User is unauthorized");
  }
};

const postRequestBody = z.object({
  body: z.string().optional(),
  image: z.string().url().optional(),
});

// Function to create a new message
const post = async (req: Request, res: Response) => {
  // Extract data from request body and authentication
  const conversationId = ObjectIdString.parse(req.params.conversationId);
  const { body, image } = postRequestBody.parse(req.body);
  const { userId: senderId } = req.auth!;
  const activeSocket = getActiveSocketId(req);

  try {
    const messageInfo = await prisma.$transaction(async (tx) => {
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

      // Return appropriate data
      return {
        messageId: newMessage.id,
        createdAt: newMessage.createdAt,
      };
    });

    type NewMessageEventPayload = {
      id: string;
      body?: string;
      image?: string;
      createdAt: Date;
      senderId: string;
    };

    io.to(conversationId)
      .except(activeSocket!)
      .emit("new-msg", conversationId, {
        id: messageInfo.messageId,
        body,
        image,
        createdAt: messageInfo.createdAt,
        senderId,
      } satisfies NewMessageEventPayload);

    type ResponseType = { messageId: string; createdAt: Date };

    return res.json(messageInfo satisfies ResponseType);
  } catch (error) {
    // Log the error and send a 403 Unauthorized response
    console.error("Transaction failed:", error);

    return res
      .status(403)
      .type("text/plain")
      .send("Unauthorized: User is unauthorized");
  }
};

const messagesWithConversationId = { get, post };

export default messagesWithConversationId;
