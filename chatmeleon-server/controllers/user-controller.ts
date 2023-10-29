import prisma from "../libs/prismadb";
import { Request, Response } from "express";

const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.id;

  const userById = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  res.json(userById);
};

export default { getUserById };
