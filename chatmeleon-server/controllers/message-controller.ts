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
      // Fetch all users from the Prisma database.
      const messageById = await prisma.message.findUnique({
        where: {
            id: messageId,
          },
      });
      
      // Send the list of users as a JSON response.
      res.send(JSON.stringify(messageById));
    } catch (error) {
      // If there's an error, log it to the console and send an error response.
      next(error);
    } finally {
      // Disconnect from the Prisma database.
      await prisma.$disconnect();
    }
  };

export default {getAllMessages, getMessageById};