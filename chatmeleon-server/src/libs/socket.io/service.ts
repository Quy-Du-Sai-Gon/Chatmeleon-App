import { io } from ".";

/**
 * Broadcast a socket event to a room.
 */
export const broadcastEvent = (
  event: string,
  info: {
    /** The socket.io room to broadcast to. */
    room: string | string[];
    /** The sender's socket id, for excluding the sender from receiving the event. */
    sender: string;
  },
  ...payload: any[]
) => {
  io.to(info.room)
    .except(info.sender)
    .emit(event, ...payload);
};
