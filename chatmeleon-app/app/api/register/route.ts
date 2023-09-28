// Import dependencies
import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

// Define the POST function to handle user registration
export async function POST(request: Request) {
    try {
        // Parse the request body as JSON
        const body = await request.json();
        const { email, name, password } = body;

        // Check if any required fields are missing in the request body
        if (!email || !name || !password) {
            // Return a response with a 400 Bad Request status and a message
            return new NextResponse('Missing info', { status: 400 });
        }

        // Hash the provided password for secure storage
        const hashedPassword = await bcrypt.hash(password, 15);

        // Create a new user in the Prisma database
        const user = await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword,
            },
        });

        // Return a JSON response with the created user data
        return NextResponse.json(user);
    } catch (error: any) {
        // Handle any errors that occur during registration
        console.log(error, 'REGISTRATION_ERROR');
        // Return an error response with a 500 Internal Server Error status
        return new NextResponse('Internal Error', { status: 500 });
    }
}
