"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ManagerOptions, Socket, SocketOptions, io } from "socket.io-client";

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

  useEffect(() => {
    if (uri !== undefined) {
      setSocket(io(uri, options));
    } else {
      setSocket(io(options));
    }
  }, [uri, options]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
