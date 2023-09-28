"use client";

// Import dependencies
import clsx from "clsx";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

// Define the props interface for the Input component
interface InputProps {
  label: string; // Label for the input field
  id: string; // ID for the input field
  type?: string; // Input field type (default is text)
  required?: boolean; // Indicates if the field is required
  register: UseFormRegister<FieldValues>; // React Hook Form register function
  errors: FieldErrors; // Errors from React Hook Form validation
  disabled?: boolean; // Indicates if the input is disabled
}

// Define the Input component
const Input: React.FC<InputProps> = ({
  label,
  id,
  type,
  required,
  register,
  errors,
  disabled,
}) => {
  return (
    <div>
      <label
        className="
                    block
                    text-sm
                    font-thin
                    leading-6
                    text-gray-900
                "
        htmlFor={id}
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          type={type}
          autoComplete={id}
          disabled={disabled}
          {...register(id, { required })}
          className={clsx(
            `
                        form-input
                        block
                        w-full
                        rounded-md
                        border-0
                        py-1.5
                        text-gray-900
                        shadow-sm
                        ring-1
                        ring-insert
                        ring-gray-300
                        placeholder:text-gray-400
                        focus:ring-2
                        focus:ring-sky-600
                        sm:text-sm
                        sm:leading-6`,
            errors[id] && "focus:ring-rose-500",
            disabled && "opacity-50 cursor-default"
          )}
        />
      </div>
    </div>
  );
};

// Export the Input component for reuse
export default Input;
