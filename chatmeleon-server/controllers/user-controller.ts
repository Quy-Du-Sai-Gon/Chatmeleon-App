import prisma from "../libs/prismadb";
import { Request, Response, NextFunction } from "express";

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;

    const userById = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    res.json(userById);
  } catch (error) {
    next(error);
  }
};

export default { getUserById };
