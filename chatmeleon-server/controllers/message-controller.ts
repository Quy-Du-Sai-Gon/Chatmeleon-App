import prisma from "../libs/prismadb";
import { Request, Response, NextFunction } from "express";

const getAllMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allMessages = await prisma.message.findMany();

  res.json(allMessages);
};

const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body, image, conversationId, senderId } = req.body;

  const newMessage = await prisma.message.create({
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

  res.sendStatus(200);
};

const updateMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const messageId = req.params.id;
  const updatedMessageData = req.body;

  const updatedMessage = await prisma.message.update({
    where: {
      id: messageId,
    },
    data: updatedMessageData,
  });

  res.json(updatedMessage);
};

const updateMessageFields = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const messageId = req.params.id;
  const updatedFields = req.body;

  const updatedMessage = await prisma.message.update({
    where: {
      id: messageId,
    },
    data: updatedFields,
  });

  res.json(updatedMessage);
};

export default {
  getAllMessages,
  createMessage,
  updateMessage,
  updateMessageFields,
};
