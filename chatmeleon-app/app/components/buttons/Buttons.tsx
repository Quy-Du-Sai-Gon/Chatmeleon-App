"use client";

// Import dependencies
import clsx from "clsx";
import { useTheme } from "@/app/context/ThemeContext"; // Assuming this is a custom theme context

// Define the props interface for the Button component
interface ButtonProps {
  type?: "button" | "submit" | "reset" | undefined; // Button type attribute
  fullWidth?: boolean; // Indicates if the button should take full width
  children?: React.ReactNode; // Content within the button
  onClick?: () => void; // Click event handler
  secondary?: boolean; // Indicates secondary button style
  danger?: boolean; // Indicates danger button style
  disabled?: boolean; // Indicates if the button is disabled
}

// Define the Button component
const Button: React.FC<ButtonProps> = ({
  type,
  fullWidth,
  children,
  onClick,
  secondary,
  danger,
  disabled,
}) => {
  const theme = useTheme(); // Custom theme context hook

  return (
    <div>
      <button
        onClick={onClick}
        type={type}
        disabled={disabled}
        className={clsx(
          `
                    flex
                    justify-center
                    rounded-md
                    px-3
                    py-2
                    text-sm
                    font-semibold
                    focus-visible:outline
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                `,
          disabled && "opacity-50 cursor-default",
          fullWidth && "w-full",
          secondary ? "text-gray-900" : "text-white",
          danger &&
            "bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600",
          !secondary &&
            !danger &&
            "bg-lavenderLizard hover:bg-lavenderLizard-dark focus-visible:outline-lavenderLizard-light"
        )}
      >
        {children}
      </button>
    </div>
  );
};

// Export the Button component for reuse
export default Button;
