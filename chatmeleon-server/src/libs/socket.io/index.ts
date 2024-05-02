import { Server } from "socket.io";
import { parseCorsOrigin } from "@/utils";
import { SocketServer } from "./types";

export const io: SocketServer = new Server({
  cors: {
    origin: parseCorsOrigin(process.env.SOCKET_IO_CORS_ORIGINS),
  },
});

import "./middlewares/auth";

import "./listeners/connection-log";
import "./listeners/auto-join-rooms";
