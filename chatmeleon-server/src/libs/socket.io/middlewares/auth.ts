import { z } from "zod";
import { io } from "..";
import { verifyChatToken } from "@/middlewares/auth";

io.use(async (socket, next) => {
  const result = z.string().safeParse(socket.handshake.auth.chatToken);
  if (!result.success) {
    return next(new Error("Invalid ChatToken"));
  }

  const { error, payload } = await verifyChatToken(result.data);
  if (error) {
    return next(new Error("Invalid ChatToken"));
  }

  socket.data.auth = payload;
  next();
});
