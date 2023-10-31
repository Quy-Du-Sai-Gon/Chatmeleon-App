// This script is used to create new record on Mongodb for testing purpose

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createUser = async () => {
  try {
    const newUser = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "john@example.com",
      },
    });

    console.log("User created:", newUser);
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await prisma.$disconnect();
  }
};

const createConversation = async () => {
  try {
    const newConversation = await prisma.conversation.create({
      data: {
        name: "Sample Conversation",
        isGroup: true,
        users: {
          connect: [{ id: "6524d06b9726a23da4002695" }],
        },
      },
    });

    console.log("Conversation created:", newConversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
  } finally {
    await prisma.$disconnect();
  }
};

const createMessage = async () => {
  try {
    const newMessageData = {
      body: "Hello, this is a test message",
      image: "example.jpg",
      conversationId: "6526151a22f25fa43da0f0f2",
      senderId: "6524d06b9726a23da4002695",
    };

    const newMessage = await prisma.message.create({
      data: newMessageData,
    });

    console.log("Message created:", newMessage);
  } catch (error) {
    console.error("Error creating message:", error);
  } finally {
    await prisma.$disconnect();
  }
};

createMessage();
