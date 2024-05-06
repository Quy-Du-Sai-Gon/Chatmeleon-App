import { io } from ".";

/**
 * Broadcast a socket event to a room.
 */
export const broadcastEvent = (
  event: string,
  info: {
    /** The socket.io room to broadcast to. */
    room: string | string[];
    /** The sender's unique room, for excluding the sender from receiving the event. */
    sender: string;
  },
  ...payload: any[]
) => {
  io.to(info.room)
    .except(info.sender)
    .emit(event, ...payload);
};

/**
 * Returns the room to receive updates from a conversation.
 */
export const ConversationRoom = (conversationId: string) =>
  `cnv:${conversationId}`;

/**
 * Make the sockets join the room.
 * @param socket The unique room to identify the socket.
 * @param room The room to join.
 */
export const socketsJoin = (
  socket: string | string[],
  room: string | string[]
) => {
  io.in(socket).socketsJoin(room);
};
