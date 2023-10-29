import prisma from "../libs/prismadb";
import { Request, Response } from "express";

const getAllMessages = async (req: Request, res: Response) => {
  const allMessages = await prisma.message.findMany();

  res.json(allMessages);
};

const createMessage = async (req: Request, res: Response) => {
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

export default {
  getAllMessages,
  createMessage,
};
