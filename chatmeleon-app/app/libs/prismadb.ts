// Import the PrismaClient from the "@prisma/client" package
import { PrismaClient } from "@prisma/client";

// Declare a global variable for the PrismaClient
declare global {
    var prisma: PrismaClient | undefined;
}

// Initialize a PrismaClient instance, or use an existing one if available globally
const client = globalThis.prisma || new PrismaClient();

// If not in production mode, assign the PrismaClient instance to the global variable
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

// Export the PrismaClient instance
export default client;
