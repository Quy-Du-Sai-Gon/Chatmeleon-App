import { Relationship } from "@prisma/client";
import prisma from "../libs/prismadb";
import { Request, Response } from "express";
import { CLIENT_RENEG_LIMIT } from "tls";

const getUsersByNameWithPagination = async (req: Request, res: Response) => {
  const { userId } = req.auth!;
  const name = req.query.name as string | "";
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
  const cursor = req.query.cursor as string | null;
  const filter = req.query.filter as Relationship | undefined;

  if (
    filter !== undefined &&
    ![
      "FRIEND",
      "BLOCK",
      "FOLLOWING",
      "PENDING_FRIEND_REQUEST",
      "SENDING_FRIEND_REQUEST",
    ].includes(filter)
  ) {
    return res.json({
      error:
        "Filter value error: Filter only accepts [FRIEND, BLOCK, FOLLOWING, PENDING_FRIEND_REQUEST, SENDING_FRIEND_REQUEST]",
    });
  }

  try {
    const results = await prisma.$transaction(async (tx) => {
      const users = await tx.user.findMany({
        where: {
          name: {
            contains: name as string,
          },
        },
        select: {
          id: true,
          name: true,
          image: true,
        },
      });

      const promises = users.map(async (user) => {
        const relationship = await tx.user_Relationship.findFirst({
          where: {
            relatingUserId: userId,
            relatedUserId: user.id,
            type: filter,
          },
        });

        if (filter && !relationship) {
          return;
        }

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
      const filterPaginatedResults = paginatedResults.filter(
        (item) => item !== undefined
      );

      filterPaginatedResults.sort((a, b) => a!.userId.localeCompare(b!.userId));
      const startIndex = cursor
        ? filterPaginatedResults.findIndex((item) => item!.userId === cursor) +
          1
        : 0;
      console.log(filterPaginatedResults);
      const currentPageResults = filterPaginatedResults.slice(
        startIndex,
        startIndex + pageSize
      );
      return currentPageResults;
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
