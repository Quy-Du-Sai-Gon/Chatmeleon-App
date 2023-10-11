import prisma from "../libs/prismadb.js"
import { Request, Response } from "express";

// Define your async route handler function
const getAllConversations = async (req: Request, res: Response) => {
    try {
      const ALL_CONVERSTATIONS = await prisma.conversation.findMany();
      res.send(JSON.stringify(ALL_CONVERSTATIONS));
    } catch (error) {
      console.error(error);
      res.send("Error, check console log");
    } finally {
      await prisma.$disconnect();
    }
  };

  const getConversationById = async (req: Request, res: Response) => {
    try {
      const CONVERSTATION_ID = req.params.id;
      const CONVERSTATION_BY_ID = await prisma.conversation.findUnique({
        where: {
          id: CONVERSTATION_ID
        }
      });
      res.send(JSON.stringify(CONVERSTATION_BY_ID));
    } catch (error) {
      console.error(error);
      res.send("Error, check console log");
    } finally {
      await prisma.$disconnect();
    }
  };

export default {getAllConversations, getConversationById};