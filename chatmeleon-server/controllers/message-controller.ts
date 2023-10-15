import prisma from "../libs/prismadb.js"
import { Request, Response, NextFunction } from "express";

// Define your async route handler function

const getAllMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Fetch all users from the Prisma database.
    const allMessages = await prisma.message.findMany();
    
    // Send the list of users as a JSON response.
    res.send(JSON.stringify(allMessages));
  } catch (error) {
    // If there's an error, log it to the console and send an error response.
    next(error);
  } finally {
    // Disconnect from the Prisma database.
    await prisma.$disconnect();
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
      res.send(JSON.stringify(messageById));
    } catch (error) {
      next(error);
    } finally {
      await prisma.$disconnect();
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
          // conversationId,
          conversation: {
            connect: {
              id: conversationId,
            }
          },
          // senderId,
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
    } finally {
      // Disconnect from the Prisma database.
      await prisma.$disconnect();
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
      res.json({message: `${messageId} deleted.`})
    } catch (error) {
      // If there's an error, log it to the console and send an error response.
      next(error);
    } finally {
      // Disconnect from the Prisma database.
      await prisma.$disconnect();
    }
  };

export default {getAllMessages, getMessageById, createMessage, deleteMessage};