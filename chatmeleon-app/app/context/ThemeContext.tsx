"use client";

// Import the necessary dependencies
import React, { createContext, useContext, ReactNode } from "react";

// Define theme object
interface Theme {
  lightLavenderLizardColor: string;
  defaultLavenderLizardColor: string;
  darkLavenderLizardColor: string;

  lightCrimsonCrawlerColor: string;
  defaultCrimsonCrawlerColor: string;
  darkCrimsonCrawlerColor: string;

  lightSunnySerpentColor: string;
  defaultSunnySerpentColor: string;
  darkSunnySerpentColor: string;
  // Add more theme properties as needed
}

// Define a default theme
const defaultTheme: Theme = {
  lightLavenderLizardColor: "#d4c9e3",
  defaultLavenderLizardColor: "#503a8f",
  darkLavenderLizardColor: "#2f2465",

  lightCrimsonCrawlerColor: "#e697b0",
  defaultCrimsonCrawlerColor: "#9d143b",
  darkCrimsonCrawlerColor: "#5d0828",

  lightSunnySerpentColor: "#ffedb4",
  defaultSunnySerpentColor: "#fed23f",
  darkSunnySerpentColor: "#e18923",
};

// Create a context for the theme
const ThemeContext = createContext<Theme>(defaultTheme);

// Create a custom hook for accessing the theme
export function useTheme() {
  return useContext(ThemeContext);
}

// Define a ThemeProvider component
interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={defaultTheme}>
      {children}
    </ThemeContext.Provider>
  );
}
