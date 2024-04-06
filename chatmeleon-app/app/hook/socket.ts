"use client";

import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { CollapsedUnion } from "@/types/utils";

/**
 * The connection state of a Socket.IO's socket. Used in React components to
 * triggers re-renders on state changes.
 * @see {@link Socket}
 */
export type SocketConnectionState =
  | {
      connected: true;
      id: string;
    }
  | {
      connected: false;
      id: undefined;
    };

/**
 * Returns the connection state of a Socket.IO's socket. Used to triggers
 * re-renders on state changes.
 */
export const useSocketConnectionState = (socket: Socket | null) => {
  type State = SocketConnectionState;
  type CollapsedState = CollapsedUnion<State>;

  const [state, setState] = useState<State>(() => {
    if (!socket) return { connected: false, id: undefined };

    const { connected, id } = socket;
    return { connected, id } satisfies CollapsedState as State;
  });

  useEffect(() => {
    if (!socket) return;

    const onChanged = () => {
      const { connected, id } = socket;
      setState({ connected, id } satisfies CollapsedState as State);
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
