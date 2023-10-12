import prisma from "../libs/prismadb.js"
import { Request, Response } from "express";

const getAllConversations = async (req: Request, res: Response) => {
  try {
    // Fetch all conversations from the Prisma database.
    const allConversations = await prisma.conversation.findMany();
    
    // Send the list of conversations as a JSON response.
    res.send(JSON.stringify(allConversations));
  } catch (error) {
    // If there's an error, log it to the console and send an error response.
    console.error(error);
    res.send("Error, check console log");
  } finally {
    // Disconnect from the Prisma database.
    await prisma.$disconnect();
  }
};

const getConversationById = async (req: Request, res: Response) => {
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
    // If there's an error, log it to the console and send an error response.
    console.error(error);
    res.send("Error, check console log");
  } finally {
    // Disconnect from the Prisma database to release resources.
    await prisma.$disconnect();
  }
};

export default {getAllConversations, getConversationById};