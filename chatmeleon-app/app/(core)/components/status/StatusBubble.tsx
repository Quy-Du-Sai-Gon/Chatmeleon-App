"use client";

import clsx from "clsx";
interface StatusBubbleProps {
  color: "red" | "green" | "yellow";
  children?: React.ReactNode;
}

const StatusBubble: React.FC<StatusBubbleProps> = ({ color, children }) => {
  return (
    <span
      className={clsx(
        `absolute
        block
        rounded-full
        ring-2
        ring-white
        top-0
        right-0
        h-2
        w-2
        md:h-3
        md:w-3
        `,
        color == "green" && `bg-green-500`,
        color == "red" && `bg-red-500`,
        color == "yellow" && `bg-yellow-400`
      )}
    >
      {children}
    </span>
  );
};

export default StatusBubble;
