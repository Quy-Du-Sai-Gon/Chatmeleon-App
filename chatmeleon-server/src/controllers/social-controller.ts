import prisma from "../libs/prismadb";
import { Request, Response } from "express";

const getUsersByNameWithPagination = async (req: Request, res: Response) => {
  const { userId } = req.auth!;
  const name = req.query.name as string | "";
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
  const cursor = req.query.cursor as string | null;
  try {
    const results = await prisma.$transaction(async (tx) => {
      const users = await tx.user.findMany({
        where: {
          name: {
            contains: req.query.name as string,
          },
        },
        select: {
          id: true,
          name: true,
          image: true,
        },
        take: pageSize,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
      });

      const promises = users.map(async (user) => {
        const relationship = await tx.user_Relationship.findFirst({
          where: {
            relatingUserId: userId,
            relatedUserId: user.id,
          },
        });

        let originalConversationId;

        if (user.id !== userId) {
          originalConversationId = await tx.conversation.findFirst({
            where: {
              AND: [
                { isGroup: false },
                { userIds: { hasEvery: [user.id, userId] } },
              ],
            },
          });
        }

        const outData = {
          userId: user.id,
          name: user.name,
          image: user.image,
          relationshipType: relationship?.type,
          originalConversationId: originalConversationId?.id,
        };
        return outData;
      });
      const paginatedResults = await Promise.all(promises);
      // const filteredResults = paginatedResults.filter(Boolean);
      // const cursorIndex = cursor
      //   ? filteredResults.findIndex((obj) => obj?.userId === cursor)
      //   : -1;
      // return filteredResults.slice(cursorIndex + 1, cursorIndex + 1 + pageSize);
      return paginatedResults;
    });
    return res.json(results);
  } catch (error) {
    console.error("Transaction failed -", error);

    return res
      .status(403)
      .type("text/plain")
      .send("Unauthorized: User is unauthorized");
  }
};

export default {
  getUsersByNameWithPagination,
};
