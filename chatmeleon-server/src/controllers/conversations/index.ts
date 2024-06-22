import { Request, Response } from "express";
import prisma from "@/libs/prismadb";
import { ObjectIdString, OptionalObjectIdString } from "@/validation";
import { prunedObject } from "@/validation/utils";
import { z } from "zod";
import {
  ConversationRoom,
  broadcastEvent,
  socketsJoin,
} from "@/libs/socket.io/service";
import { io } from "@/libs/socket.io";

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
      userIds: true,
    },
  });

  // Fetch the last message details for each conversation
  const lastMessageIds = conversations.map((conv) => conv.lastMessageId);
  const lastMessages = await prisma.message.findMany({
    where: {
      id: {
        in: lastMessageIds,
      },
    },
    select: {
      id: true,
      body: true,
      image: true,
      createdAt: true,
      sender: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Map it to a key-value pairs object to faster look up
  const lastMessagesMap = lastMessages.reduce((acc, message) => {
    acc[message.id] = message;
    return acc;
  }, {} as Record<string, (typeof lastMessages)[0]>);

  type ResponseType = Array<{
    id: string;
    name?: string | null;
    image?: string | null;
    isGroup: boolean;
    lastMessage?: {
      body?: string | null;
      image?: string | null;
      createdAt: Date;
      sender: {
        id: string;
        name?: string | null;
      };
    };
  }>;

  const combined_data: ResponseType = await Promise.all(
    conversations.map(async (conversation) => {
      // Check if conversation is non-group and has exactly 2 users
      if (!conversation.isGroup && conversation.userIds.length === 2) {
        const otherUserId = conversation.userIds.find((uid) => uid !== userId);
        if (otherUserId) {
          const otherUser = await prisma.user.findFirst({
            where: {
              id: otherUserId,
            },
            select: {
              name: true,
              image: true,
            },
          });
          return {
            id: conversation.id,
            name: otherUser?.name,
            image: otherUser?.image, // Assuming 'image' is the field for avatar
            isGroup: false,
            lastMessage: lastMessagesMap[conversation.lastMessageId]
              ? {
                  body: lastMessagesMap[conversation.lastMessageId].body,
                  image: lastMessagesMap[conversation.lastMessageId].image,
                  createdAt:
                    lastMessagesMap[conversation.lastMessageId].createdAt,
                  sender: {
                    id: lastMessagesMap[conversation.lastMessageId].sender.id,
                    name: lastMessagesMap[conversation.lastMessageId].sender
                      .name,
                  },
                }
              : undefined,
          };
        }
      }

      // For group conversations or non-group with more than 2 users, use original conversation details
      return {
        id: conversation.id,
        name: conversation.name,
        image: conversation.groupAvatar,
        isGroup: conversation.isGroup,
        lastMessage: lastMessagesMap[conversation.lastMessageId]
          ? {
              body: lastMessagesMap[conversation.lastMessageId].body,
              image: lastMessagesMap[conversation.lastMessageId].image,
              createdAt: lastMessagesMap[conversation.lastMessageId].createdAt,
              sender: {
                id: lastMessagesMap[conversation.lastMessageId].sender.id,
                name: lastMessagesMap[conversation.lastMessageId].sender.name,
              },
            }
          : undefined,
      };
    })
  );

  const response = combined_data.map(prunedObject);

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
        cnvCreatedAt: newConversation.createdAt,
        msgCreatedAt: createdMessage.createdAt,
      };
    });

    // Socket events
    const { conversationId, cnvCreatedAt, messageId, msgCreatedAt } =
      conversationAndMessageInfo;

    socketsJoin([senderId, relatedUserId], ConversationRoom(conversationId));

    // New conversation event
    type NewConversationEventPayload = {
      id: string;
      lastMessageId: string;
      name?: string;
      groupAvatar?: string;
      isGroup: boolean;
    };

    broadcastEvent(
      "new-cnv",
      {
        room: ConversationRoom(conversationId),
        sender: req.chatToken!,
      },
      {
        id: conversationId,
        lastMessageId: messageId,
        isGroup: false,
      } satisfies NewConversationEventPayload
    );

    // New message event
    type NewMessageEventPayload = {
      id: string;
      body?: string;
      image?: string;
      createdAt: Date;
      senderId: string;
    };

    broadcastEvent(
      "new-msg",
      {
        room: ConversationRoom(conversationId),
        sender: req.chatToken!,
      },
      conversationId,
      {
        id: messageId,
        body,
        image,
        createdAt: msgCreatedAt,
        senderId,
      } satisfies NewMessageEventPayload
    );

    // API Response
    type ResponseType = {
      conversationId: string;
      messageId: string;
      createdAt: Date;
    };

    return res.json({
      conversationId,
      messageId,
      createdAt: cnvCreatedAt,
    } satisfies ResponseType);
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
