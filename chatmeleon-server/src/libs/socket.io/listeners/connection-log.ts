import { io } from "..";

io.on("connection", (socket) => {
  const { userId } = socket.data.auth;

  console.log(`User "${userId}" connected with socket id "${socket.id}"`);

  socket.on("disconnect", () => {
    console.log(`User "${userId}" disconnected the socket "${socket.id}"`);
  });
});
