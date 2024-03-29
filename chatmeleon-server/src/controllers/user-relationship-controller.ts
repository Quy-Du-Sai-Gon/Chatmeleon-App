import prisma from "../libs/prismadb";
import { Request, Response } from "express";

const createFriendRequestRelationship = async (req: Request, res: Response) => {
  const { relatedUserId } = req.body;
  const { userId: relatingUserId } = req.auth!;
  // Utilize a Prisma transaction to ensure atomicity and data consistency
  try {
    await prisma.$transaction(async (tx) => {
      // Check if the users are the same
      if (relatingUserId === relatedUserId) {
        throw new Error("Invalid: Cannot create relationship with oneself");
      }
      // Check if the relevant records already exist
      const existingRelationship = await tx.user_Relationship.findMany({
        where: {
          OR: [
            {
              relatingUserId: relatingUserId,
              relatedUserId: relatedUserId,
              type: "FRIEND",
            },
            {
              relatingUserId: relatingUserId,
              relatedUserId: relatedUserId,
              type: "SENDING_FRIEND_REQUEST",
            },
          ],
        },
      });
      if (existingRelationship && existingRelationship.length == 1) {
        if (existingRelationship[0].type == "FRIEND") {
          // Records already exist, handle accordingly
          throw new Error(
            'Conflicted: Relationship of "FRIEND" type already existed'
          ); // Return an error code
        } else if (existingRelationship[0].type == "SENDING_FRIEND_REQUEST") {
          // Records already exist, handle accordingly
          throw new Error(
            "Conflicted: Relationship of this type already existed"
          ); // Return an error code
        }
      }
      // Create new records
      await tx.user_Relationship.createMany({
        data: [
          {
            relatingUserId: relatingUserId,
            relatedUserId: relatedUserId,
            type: "SENDING_FRIEND_REQUEST",
          },
          {
            relatingUserId: relatedUserId,
            relatedUserId: relatingUserId,
            type: "PENDING_FRIEND_REQUEST",
          },
        ],
      });
    });
  } catch (error) {
    // Log the error and send a 403 Unauthorized response
    console.error("Transaction failed -", error);
    return res
      .status(403)
      .type("text/plain")
      .send("Unauthorized: User is unauthorized");
  }
  // All operations successful, send a success response
  res.status(200).type("text/plain").send("OK");
};

const createFriendRelationship = async (req: Request, res: Response) => {
  const { relatedUserId } = req.body;
  const { userId: relatingUserId } = req.auth!;
  // Utilize a Prisma transaction to ensure atomicity and data consistency
  try {
    await prisma.$transaction(async (tx) => {
      // Check if the users are the same
      if (relatingUserId === relatedUserId) {
        throw new Error("Invalid: Cannot create relationship with oneself");
      }
      // Check if the records already exist
      const existingRelationship = await tx.user_Relationship.findMany({
        where: {
          OR: [
            {
              relatingUserId: relatingUserId,
              relatedUserId: relatedUserId,
              type: "FRIEND",
            },
            {
              relatingUserId: relatingUserId,
              relatedUserId: relatedUserId,
              type: "SENDING_FRIEND_REQUEST",
            },
          ],
        },
      });
      if (existingRelationship && existingRelationship.length == 1) {
        if (existingRelationship[0].type == "FRIEND") {
          // Records already exist, handle accordingly
          throw new Error(
            "Conflicted: Relationship of this type already existed"
          ); // Return an error code
        } else if (existingRelationship[0].type == "SENDING_FRIEND_REQUEST") {
          // User not authorized, handle accordingly
          throw new Error(
            "Unauthorized: User not authorized to modify the relationship"
          ); // Return an error code
        }
      }
      // Update records
      await tx.user_Relationship.updateMany({
        where: {
          OR: [
            {
              relatingUserId: relatingUserId,
              relatedUserId: relatedUserId,
              type: "PENDING_FRIEND_REQUEST",
            },
            {
              relatingUserId: relatedUserId,
              relatedUserId: relatingUserId,
              type: "SENDING_FRIEND_REQUEST",
            },
          ],
        },
        data: {
          type: "FRIEND",
        },
      });
    });
  } catch (error) {
    // Log the error and send a 403 Unauthorized response
    console.error("Transaction failed -", error);
    return res
      .status(403)
      .type("text/plain")
      .send("Unauthorized: User is unauthorized");
  }
  // All operations successful, send a success response
  res.status(200).type("text/plain").send("OK");
};

const deleteFriendRequestRelationship = async (req: Request, res: Response) => {
  const { relatedUserId } = req.body;
  const { userId: relatingUserId } = req.auth!;
  // Utilize a Prisma transaction to ensure atomicity and data consistency
  try {
    await prisma.$transaction(async (tx) => {
      // Check if the users are the same
      if (relatingUserId === relatedUserId) {
        throw new Error("Invalid: Cannot delete relationship with oneself");
      }
      // Check if the records already exist
      const existingRelationship = await tx.user_Relationship.findMany({
        where: {
          OR: [
            {
              relatingUserId: relatingUserId,
              relatedUserId: relatedUserId,
              type: "FRIEND",
            },
            {
              relatingUserId: relatingUserId,
              relatedUserId: relatedUserId,
              type: "SENDING_FRIEND_REQUEST",
            },
          ],
        },
      });
      if (existingRelationship && existingRelationship.length == 1) {
        if (existingRelationship[0].type == "FRIEND") {
          // Records already exist, handle accordingly
          throw new Error(
            'Conflicted: Relationship of "FRIEND" type already existed'
          ); // Return an error code
        } else if (existingRelationship[0].type == "SENDING_FRIEND_REQUEST") {
          // User not authorized, handle accordingly
          throw new Error(
            "Unauthorized: User not authorized to modify the relationship"
          ); // Return an error code
        }
      }
      // Delete records
      await tx.user_Relationship.deleteMany({
        where: {
          OR: [
            {
              relatingUserId: relatingUserId,
              relatedUserId: relatedUserId,
              type: "PENDING_FRIEND_REQUEST",
            },
            {
              relatingUserId: relatedUserId,
              relatedUserId: relatingUserId,
              type: "SENDING_FRIEND_REQUEST",
            },
          ],
        },
      });
    });
  } catch (error) {
    // Throw the error to trigger the transaction rollback
    // Log the error and send a 403 Unauthorized response
    console.error("Transaction failed -", error);
    return res
      .status(403)
      .type("text/plain")
      .send("Unauthorized: User is unauthorized");
  }
  // All operations successful, send a success response
  res.status(200).type("text/plain").send("OK");
};

export default {
  createFriendRequestRelationship,
  createFriendRelationship,
  deleteFriendRequestRelationship,
};
