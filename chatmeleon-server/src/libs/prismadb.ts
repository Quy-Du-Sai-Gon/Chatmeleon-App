// Import the PrismaClient from the "@prisma/client" package
import { PrismaClient } from "@prisma/client";

// Initialize a PrismaClient instance, or use an existing one if available globally
const prisma = new PrismaClient();

// Export the PrismaClient instance
export default prisma;
