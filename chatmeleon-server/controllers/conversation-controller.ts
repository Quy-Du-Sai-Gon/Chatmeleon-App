import prisma from "../libs/prismadb";
import { Request, Response, NextFunction } from "express";

const getAllConversationsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

const getConversationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

const postConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

const updateConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const conversationId = req.params.id;
    const updatedConversationData = req.body;

    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: updatedConversationData,
    });

    res.json(updatedConversation);
  } catch (error) {
    next(error);
  }
};

const updateConversationFields = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const conversationId = req.params.id;
    const updatedFields = req.body;

    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: updatedFields,
    });

    res.json(updatedConversation);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllConversationsByUserId,
  getConversationById,
  postConversation,
  updateConversation,
  updateConversationFields,
};
