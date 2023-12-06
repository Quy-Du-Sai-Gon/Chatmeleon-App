// Import dependencies and providers
import bcrypt from "bcrypt";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import jwt from "jsonwebtoken";

import prisma from "@/app/libs/prismadb";
import { ChatTokenPayload } from "@/types/auth";

// Define authentication options
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma), // Use PrismaAdapter with your Prisma instance
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        if (!email || !password) {
          throw new Error("Invalid credentials");
        }

        // Fetch the user from your Prisma database using the provided email
        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid credentials");
        }

        // Compare the provided password with the hashed password from the database
        const isCorrectPassword = await bcrypt.compare(
          password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return user; // Return the user object if authentication is successful
      },
    }),
  ],
  debug: process.env.NODE_ENV == "development", // Enable debugging in development mode
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET, // Secret key for session
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.chatToken = jwt.sign(
          { userId: user.id } satisfies ChatTokenPayload,
          process.env.CHAT_TOKEN_SECRET!
        );
      }

      return token;
    },

    async session({ session, token }) {
      session.chatToken = token.chatToken;

      return session;
    },
  },
};

// Create the authentication handler
const handler = NextAuth(authOptions);

// Export the handler for both GET and POST requests
export { handler as GET, handler as POST };
