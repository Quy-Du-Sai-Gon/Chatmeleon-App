import prisma from "../libs/prismadb";
import { Request, Response } from "express";

const getConversationById = async (req: Request, res: Response) => {
  const id = req.params.conversationId;
  const userConversations = await prisma.conversation.findUnique({
    where: {
      id: id,
      userIds: {
        has: req.auth!.userId,
      },
    },
  });

  if (!userConversations) {
    return res
      .status(404)
      .type("text/plain")
      .send("Not Found - Conversation not found.");
  }

  res.json(userConversations);
};

const getConversationsWithPagination = async (req: Request, res: Response) => {
  const { userId } = req.auth!;
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
  const cursor = req.query.cursor as string | undefined;

  const conversations = await prisma.conversation.findMany({
    where: {
      userIds: {
        has: userId,
      },
      id: {
        gt: cursor,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    take: pageSize,
  });

  // Extract the last conversation's cursor for pagination.
  const lastConversation = conversations[conversations.length - 1];
  const nextCursor = lastConversation ? lastConversation.id : null;

  res.json({
    conversations,
    nextCursor,
  });
};

const postConversation = async (req: Request, res: Response) => {
  const { lastMessageAt, name, isGroup, messagesIds, userIds } = req.body;
  userIds.unshift(req.auth!.userId);

  const createdAt = new Date().toISOString();

  const messages = await prisma.message.findMany({
    where: {
      id: { in: messagesIds },
    },
  });

  const users = await prisma.user.findMany({
    where: {
      id: { in: userIds },
    },
  });

  const newConversation = await prisma.conversation.create({
    data: {
      createdAt,
      lastMessageAt,
      name,
      isGroup,
      messagesIds,
      messages: {
        connect: messages.map((message) => ({ id: message.id })),
      },
      userIds,
      users: {
        connect: users.map((user) => ({ id: user.id })),
      },
    },
  });

  res.json(newConversation);
};

export default {
  getConversationById,
  getConversationsWithPagination,
  postConversation,
};
