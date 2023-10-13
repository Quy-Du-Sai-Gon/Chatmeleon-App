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

/* Request body example
{
    "lastMessageAt": "2023-10-11T03:23:06.107+00:00",
    "name": "Test",
    "isGroup": false,
    "messagesIds": ["6526151a22f25fa43da0f0f3"],
    "userIds": ["6524d06b9726a23da4002695"]
}
*/

const postConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      lastMessageAt,
      name,
      isGroup,
      messagesIds,
      userIds,
    } = req.body;

    const createdAt = new Date().toISOString();

    const messages = await prisma.message.findMany({
      where: {
        id: { in: messagesIds },
      },
    })

    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
    })

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
      }
    })

    res.json(newConversation);
  } catch (error) {
    next(error);
  } finally {
    // Disconnect from the Prisma database to release resources.
    await prisma.$disconnect();
  }
};

const updateConversation = async (req: Request, res: Response, next: NextFunction) => {
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
  }
  catch (error) {
    next(error);
  }
  finally {
    // Disconnect from the Prisma database to release resources.
    await prisma.$disconnect();
  }
}

const updateConversationFields = async (req: Request, res: Response, next: NextFunction) => {
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
}

const deleteConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conversationId = req.params.id;

    await prisma.conversation.delete({
      where: {
        id: conversationId,
      }
    })

    res.json({ message: `${conversationId} deleted.` });
  } catch (error) {

  }
}

export default { getAllConversations, getConversationById, postConversation, updateConversation, updateConversationFields, deleteConversation };