import React from "react";
interface EmptyStateProps {
  className?: string; // Define the type for className
}

const EmptyState: React.FC<EmptyStateProps> = ({ className }) => {
  return (
    <div
      className={` 
        px-4
        py-10
        sm:px-6
        lg:px-8
        h-full
        flex
        justify-center
        items-center
        ${className || 'bg-gray-100'}
      `}
    >
      <div className="text-center items-center flex flex-col">
        <h3
          className="
            mt-2
            text-2xl
            font-semibold
            text-gray-900
          "
        >
          Select a chat or start a new conversation
        </h3>
      </div>
    </div>
  );
};

export default EmptyState;
