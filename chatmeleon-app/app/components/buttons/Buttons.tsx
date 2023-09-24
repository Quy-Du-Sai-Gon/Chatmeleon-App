'use client';

import clsx from "clsx";
import { useTheme } from "@/app/context/ThemeContext";
interface ButtonProps {
    type?: 'button' | 'submit' | 'reset' | undefined;
    fullWidth?: boolean;
    children?: React.ReactNode;
    onClick?: () => void;
    secondary?: boolean;
    danger?: boolean;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    type,
    fullWidth,
    children,
    onClick,
    secondary,
    danger,
    disabled
}) => {
    const theme = useTheme();
    
    return (
        <div>
            <button
                onClick={onClick}
                type={type}
                disabled={disabled}
                className={clsx(`
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
                secondary ? 'text-gray-900' : 'text-white',
                danger && "bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600",
                !secondary && !danger && "bg-lavenderLizard hover:bg-lavenderLizard-dark focus-visible:outline-lavenderLizard-light"
                )}
            >
                {children}
            </button>
        </div>
    );
}

export default Button;