import prisma from "../libs/prismadb";
import { Request, Response, NextFunction } from "express";

const getAllConversationsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.userId;
  const userConversations = await prisma.conversation.findMany({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
  });

  // Send the list of conversations as a JSON response.
  res.json(userConversations);
};

const getConversationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extract the conversation ID from the request parameters.
  const conversationId = req.params.id;

  // Query the Prisma database to find a conversation by its ID.
  const conversationById = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
  });

  // Send the conversation data as a JSON response.
  res.json(conversationById);
};

const postConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { lastMessageAt, name, isGroup, messagesIds, userIds } = req.body;

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

const updateConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const conversationId = req.params.id;
  const updatedConversationData = req.body;

  const updatedConversation = await prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data: updatedConversationData,
  });

  res.json(updatedConversation);
};

const updateConversationFields = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const conversationId = req.params.id;
  const updatedFields = req.body;

  const updatedConversation = await prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data: updatedFields,
  });

  res.json(updatedConversation);
};

export default {
  getAllConversationsByUserId,
  getConversationById,
  postConversation,
  updateConversation,
  updateConversationFields,
};
