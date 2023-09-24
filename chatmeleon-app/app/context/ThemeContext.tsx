'use client';

// ThemeContext.tsx

import React, { createContext, useContext, ReactNode } from 'react';

// Define your theme object
interface Theme {
  darkLavenderLizardColor1: string;
  normalLavenderLizardColor1: string;
  brightLavenderLizardColor1: string;
  // Add more theme properties as needed
}

// Define a default theme
const defaultTheme: Theme = {
    darkLavenderLizardColor1: "#2f2465",
    normalLavenderLizardColor1: "#503a8f",
    brightLavenderLizardColor1: "#d4c9e3",
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

export function ThemeProvider({ 
    children 
}: ThemeProviderProps) {
    return (
      <ThemeContext.Provider value={defaultTheme}>
        {children}
      </ThemeContext.Provider>
    );
}
