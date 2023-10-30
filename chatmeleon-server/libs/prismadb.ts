// Import the PrismaClient from the "@prisma/client" package
import { PrismaClient } from "@prisma/client";

// Initialize a PrismaClient instance, or use an existing one if available globally
const client = new PrismaClient();

// Export the PrismaClient instance
export default client;
