import { Server } from "socket.io";
import { parseCorsOrigin } from "@/utils";

export const io = new Server({
  cors: {
    origin: parseCorsOrigin(process.env.SOCKET_IO_CORS_ORIGINS),
  },
});

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);
  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });
});
