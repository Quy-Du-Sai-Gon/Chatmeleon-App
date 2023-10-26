import prisma from "../libs/prismadb"
import { Request, Response, NextFunction } from "express";

const getAllMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allMessages = await prisma.message.findMany();

    res.json(allMessages);
  } catch (error) {
    next(error);
  }
};

const getMessageById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messageId = req.params.id;
    const messageById = await prisma.message.findUnique({
      where: {
        id: messageId
      }
    })
    res.json(messageById);
  } catch (error) {
    next(error);
  }
};

const createMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      body,
      image,
      conversationId,
      senderId,
    } = req.body;

    const newMessage = await prisma.message.create({
      data: {
        body,
        image,
        conversation: {
          connect: {
            id: conversationId,
          }
        },
        sender: {
          connect: {
            id: senderId,
          }
        }
      }
    })

    res.json(newMessage);
  } catch (error) {
    // If there's an error, log it to the console and send an error response.
    next(error);
  }
};

const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messageId = req.params.id;
    await prisma.message.delete({
      where: {
        id: messageId,
      }
    })
    res.json({ message: `${messageId} deleted.` })
  } catch (error) {
    // If there's an error, log it to the console and send an error response.
    next(error);
  }
};

const updateMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messageId = req.params.id;
    const updatedMessageData = req.body;

    const updatedMessage = await prisma.message.update({
      where: {
        id: messageId,
      },
      data: updatedMessageData,
    });

    res.json(updatedMessage);
  }
  catch (error) {
    next(error);
  }
};

const updateMessageFields = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messageId = req.params.id;
    const updatedFields = req.body;

    const updatedMessage = await prisma.message.update({
      where: {
        id: messageId,
      },
      data: updatedFields,
    });

    res.json(updatedMessage);
  } catch (error) {
    next(error);
  }
}

export default { getAllMessages, getMessageById, createMessage, deleteMessage, updateMessage, updateMessageFields };