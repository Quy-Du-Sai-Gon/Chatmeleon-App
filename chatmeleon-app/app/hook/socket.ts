"use client";

import { useEffect, useMemo, useState } from "react";
import { Socket } from "socket.io-client";
import { CollapsedUnion } from "@/types/utils";
import { useSocket } from "../context/SocketContext";

type SocketConnectedStates = {
  connected: true;
  id: string;
};

type SocketDisconnectedStates = {
  connected: false;
  id: undefined;
};

/**
 * The states of a Socket.IO's socket. Used in React components to trigger
 * re-renders on state changes.
 * @see {@link Socket}
 */
export type SocketStates = SocketConnectedStates | SocketDisconnectedStates;

/**
 * Returns the states of a Socket.IO's socket. Used to trigger re-renders on
 * state changes.
 */
export const useSocketStates = (socket: Socket | null) => {
  type CollapsedStates = CollapsedUnion<SocketStates>;

  const [state, setState] = useState<SocketStates>(() => {
    if (!socket) return { connected: false, id: undefined };

    const { connected, id } = socket;
    return { connected, id } satisfies CollapsedStates as SocketStates;
  });

  useEffect(() => {
    if (!socket) return;

    const onChanged = () => {
      const { connected, id } = socket;
      setState({ connected, id } satisfies CollapsedStates as SocketStates);
    };

    socket.on("connect", onChanged);
    socket.on("disconnect", onChanged);

    return () => {
      socket.off("connect", onChanged);
      socket.off("disconnect", onChanged);
    };
  }, [socket]);

  return state;
};

/**
 * @see {@link Socket}
 * @see {@link SocketStates}
 * @see {@link useSocketWithStates}
 */
export type SocketWithStates =
  | ({ socket: Socket } & SocketStates)
  | ({ socket: null } & SocketDisconnectedStates);

/**
 * Returns the current context Socket.IO's Socket instance, for real-time
 * communication with a Socket.IO server, along with its states, used to trigger
 * re-renders on state changes.
 *
 * A short-hand for calling `useSocket` and `useSocketStates(socket)` together.
 */
export const useSocketWithStates = (): SocketWithStates => {
  type CollapsedType = CollapsedUnion<SocketWithStates>;

  const socket = useSocket();
  const states = useSocketStates(socket);

  const socketWithStates = useMemo(
    () => ({ socket, ...states } satisfies CollapsedType as SocketWithStates),
    [socket, states]
  );

  return socketWithStates;
};
