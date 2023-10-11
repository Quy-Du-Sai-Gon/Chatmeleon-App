import prisma from "../libs/prismadb.js"
import { Request, Response } from "express";

async function testConnectWithDatabase() {
    try {
      const allUsers = await prisma.user.findMany();
      console.log(allUsers);
      return allUsers;
    } catch (error) {
      console.error('Error retrieving users:', error);
    } finally {
      await prisma.$disconnect();
    }
  }

// Define your async route handler function
const testRouteHandler = async (req: Request, res: Response) => {
  try {
    const TEST = await testConnectWithDatabase();
    res.send(JSON.stringify(TEST));
  } catch (error) {
    console.error(error);
    res.send("VCL");
  }
};

export default testRouteHandler;