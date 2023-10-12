import prisma from "../libs/prismadb.js"
import { Request, Response, NextFunction } from "express";

// Define your async route handler function

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Fetch all users from the Prisma database.
    const allUsers = await prisma.user.findMany();
    
    // Send the list of users as a JSON response.
    res.send(JSON.stringify(allUsers));
  } catch (error) {
    // If there's an error, log it to the console and send an error response.
    next(error);
  } finally {
    // Disconnect from the Prisma database.
    await prisma.$disconnect();
  }
};


const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract the user ID from the request parameters.
    const userId = req.params.id;
    
    // Query the Prisma database to find a user by their ID.
    const userById = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    
    // Send the user data as a JSON response.
    res.send(JSON.stringify(userById));
  } catch (error) {
    // If there's an error, log it to the console and send an error response.
    next(error);
  } finally {
    // Disconnect from the Prisma database to release resources.
    await prisma.$disconnect();
  }
};


export default {getAllUsers, getUserById};