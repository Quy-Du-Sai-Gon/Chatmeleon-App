import { Server } from "socket.io";

function parseCorsOrigin(value: string | undefined) {
  if (value === undefined) return;

  const origins = value.split(",");

  if (origins.length <= 1) {
    return origins[0];
  }

  return origins;
}

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
