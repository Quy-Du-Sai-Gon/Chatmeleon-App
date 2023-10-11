import prisma from "../libs/prismadb.js"
import { Request, Response } from "express";

// Define your async route handler function
const getAllConverstations = async (req: Request, res: Response) => {
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


  
export default {getAllConverstations};