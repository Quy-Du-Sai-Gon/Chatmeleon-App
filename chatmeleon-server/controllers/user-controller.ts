import prisma from "../libs/prismadb";
import { Request, Response, NextFunction } from "express";

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id;

  const userById = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  res.json(userById);
};

export default { getUserById };
