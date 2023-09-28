// Import external dependencies
import React from "react";
import type { Metadata } from "next";

// Import CSS and styling
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { Poppins } from "next/font/google";

// Import contexts
import ToasterContext from "./context/ToasterContext";
import AuthContext from "./context/AuthContext";

// Define the Poppins font settings
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

// Metadata for the HTML document
export const metadata: Metadata = {
  title: "Chatmeleon",
  description: "hehe",
};

// Define the RootLayout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        {/* Wrap the application with ThemeProvider for theme context */}
        <ThemeProvider>
          {/* Wrap the application with AuthContext for authentication context */}
          <AuthContext>
            {/* Provide a context for displaying toasts */}
            <ToasterContext />
            {/* Render the children components */}
            {children}
          </AuthContext>
        </ThemeProvider>
      </body>
    </html>
  );
}
