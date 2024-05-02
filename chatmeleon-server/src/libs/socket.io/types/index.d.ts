import { ChatTokenPayload } from "@/types/auth";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export interface SocketData {
  auth: ChatTokenPayload;
  chatToken: string;
}

export type SocketServer = Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  SocketData
>;
