"use client";

// Import dependencies
import { SessionProvider } from "next-auth/react";

// Define the AuthContextProps interface for component props
interface AuthContextProps {
  children: React.ReactNode; // Children components to be wrapped by the AuthContext
}

// Define the AuthContext component
export default function AuthContext({ children }: AuthContextProps) {
  return (
    // Wrap the children components with the SessionProvider
    <SessionProvider>{children}</SessionProvider>
  );
}
