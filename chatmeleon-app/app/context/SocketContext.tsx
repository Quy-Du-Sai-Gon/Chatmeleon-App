"use client";

import { Socket } from "@/types/socket";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ManagerOptions, SocketOptions, io } from "socket.io-client";

/**
 * Context for a Socket.IO's Socket.
 */
export const SocketContext = createContext<Socket | null>(null);

/**
 * Returns the current context Socket.IO's Socket instance, for real-time
 * communication with a Socket.IO server.
 */
export function useSocket() {
  return useContext(SocketContext);
}

export interface SocketProviderProps {
  children: React.ReactNode;

  /**
   * URI of the Socket.IO server. Defaults to env "NEXT_PUBLIC_SOCKET_IO_SERVER_URI".
   */
  uri?: string;

  /**
   * Options to create a Socket.IO's Socket instance.
   */
  options?: Partial<ManagerOptions & SocketOptions>;
}

/**
 * A default provider for the `SocketContext`.
 */
export function SocketProvider({
  children,
  uri = process.env.NEXT_PUBLIC_SOCKET_IO_SERVER_URI,
  options,
}: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);

  const session = useSession();
  const chatToken = session.data?.chatToken;

  useEffect(() => {
    if (!chatToken) {
      setSocket(null);
      return;
    }

    const opts = { auth: { chatToken }, ...options } satisfies typeof options;

    if (uri !== undefined) {
      setSocket(io(uri, opts));
    } else {
      setSocket(io(opts));
    }
  }, [uri, options, chatToken]);

  // clean up
  useEffect(() => {
    if (!socket) return;

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useDefaultSocketLogging(socket);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

const useDefaultSocketLogging = (socket: Socket | null) => {
  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
      if (socket.recovered) {
        console.log(`Socket "${socket.id}" recovered connection.`);
      } else {
        console.log(`Socket connected with id "${socket.id}".`);
      }
    };

    const onConnectError = (error: Error) => {
      console.error(`Socket connect error: "${error}".`);
    };

    const onDisconnect = (reason: string) => {
      console.log(`Socket disconnected because "${reason}"`);
    };

    socket.on("connect", onConnect);
    socket.on("connect_error", onConnectError);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("connect_error", onConnectError);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);
};
