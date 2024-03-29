import prisma from "../libs/prismadb";
import { Request, Response } from "express";

const getFriendsWithPagination = async (req: Request, res: Response) => {
  const { userId } = req.auth!;
  const name = req.query.name as string | "";
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
  const cursor = req.query.cursor as string | undefined;

  try {
    const results = await prisma.$transaction(async (tx) => {
      const relationships = await tx.user_Relationship.findMany({
        where: {
          relatingUserId: userId,
          type: "FRIEND",
        },
        select: {
          relatedUserId: true,
          type: true,
        },
      });

      const promises = relationships.map(async (relationship) => {
        const friendData = await tx.user.findFirst({
          where: {
            id: relationship.relatedUserId,
            name: {
              contains: name,
            },
          },
          select: {
            id: true,
            name: true,
            image: true,
          },
        });
        if (friendData) {
          const originalConversationId = await tx.conversation.findFirst({
            where: {
              AND: [
                { isGroup: false },
                { userIds: { hasEvery: [relationship.relatedUserId, userId] } },
              ],
            },
            select: {
              id: true,
            },
          });
          const outData = {
            userId: friendData?.id,
            name: friendData?.name,
            image: friendData?.image,
            relationshipType: relationship.type,
            originalConversationId: originalConversationId?.id,
          };
          return outData;
        }
      });

      const paginatedResults = await Promise.all(promises);
      const filteredResults = paginatedResults.filter(Boolean);
      const cursorIndex = cursor
        ? filteredResults.findIndex((obj) => obj?.userId === cursor)
        : -1;
      return filteredResults.slice(cursorIndex + 1, cursorIndex + 1 + pageSize);
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

export default { getFriendsWithPagination };
