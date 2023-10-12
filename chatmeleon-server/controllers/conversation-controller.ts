import prisma from "../libs/prismadb.js"
import { Request, Response, NextFunction } from "express";

const getAllConversations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Fetch all conversations from the Prisma database.
    const allConversations = await prisma.conversation.findMany();

    // Send the list of conversations as a JSON response.
    res.send(JSON.stringify(allConversations));
  } catch (error) {
    next(error);
  } finally {
    // Disconnect from the Prisma database.
    await prisma.$disconnect();
  }
};

const getConversationById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract the conversation ID from the request parameters.
    const conversationId = req.params.id;

    // Query the Prisma database to find a conversation by its ID.
    const conversationById = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      }
    });

    // Send the conversation data as a JSON response.
    res.send(JSON.stringify(conversationById));
  } catch (error) {
    next(error);
  } finally {
    // Disconnect from the Prisma database to release resources.
    await prisma.$disconnect();
  }
};

const postConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      // lastMessageAt,
      name,
      isGroup,
      messagesIds,
      // messages,
      userIds,
      // users,
    } = req.body;

    // const createdAt = new Date().toISOString().slice(0, 10);
    const createdAt = "2023-10-11T03:23:06.107+00:00";

    await prisma.conversation.create({
      data: {
        createdAt,
        // lastMessageAt,
        name,
        isGroup,
        messagesIds,
        // messages,
        userIds,
        // users,
      }
    })

    res.send("Created!")
  } catch (error) {
    next(error);
  }
}

export default { getAllConversations, getConversationById, postConversation };