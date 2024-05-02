import prisma from "@/libs/prismadb";
import { io } from "..";
import { ConversationRoom } from "../service";

io.on("connection", async (socket) => {
  // join unique rooms with our credentials
  socket.join([socket.data.chatToken, socket.data.auth.userId]);

  const conversations = await prisma.conversation.findMany({
    where: {
      userIds: {
        has: socket.data.auth.userId,
      },
    },
    select: {
      id: true,
    },
  });

  const rooms = conversations.map((convo) => ConversationRoom(convo.id));

  socket.join(rooms);

  console.log(`Socket "${socket.id}" joined the rooms:`, rooms);
});
