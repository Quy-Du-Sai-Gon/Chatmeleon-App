import prisma from "../libs/prismadb.js"
import { Request, Response } from "express";

// Define your async route handler function
const getAllUser = async (req: Request, res: Response) => {
  try {
    const ALL_USERS = await prisma.user.findMany();
    res.send(JSON.stringify(ALL_USERS));
  } catch (error) {
    console.error(error);
    res.send("Error, check console log");
  } finally {
    await prisma.$disconnect();
  }
};

const getUserById = async (req: Request, res: Response) => {
    try {
      const USER_ID = req.params.id;
      const USER = await prisma.user.findUnique({
        where: {
          id: USER_ID,
        },
      });
      res.send(JSON.stringify(USER));
    } catch (error) {
      console.error(error);
      res.send("Error, check console log");
    } finally {
      await prisma.$disconnect();
    }
  };

export default {getAllUser, getUserById};