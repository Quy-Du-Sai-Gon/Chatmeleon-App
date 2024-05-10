"use client";

import { FC, useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { Message } from "./types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface ExampleInputProps {
  conversationId: string;
  onMessageSent: (msg: Message) => void;
}

const ExampleInput: FC<ExampleInputProps> = ({
  conversationId,
  onMessageSent,
}) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<Error | null>(null);

  const session = useSession();

  const postMessage = useCallback(
    async (message: string) => {
      if (session.status !== "authenticated") {
        throw new Error("Unauthenticated");
      }

      const {
        chatToken,
        user: { id: userId },
      } = session.data;

      const postMessageURL = `${BACKEND_URL}/conversations/${conversationId}/messages`;

      const res = await fetch(postMessageURL, {
        method: "POST",
        body: JSON.stringify({ body: message }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${chatToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      if (!res.headers.get("Content-Type")?.includes("application/json")) {
        throw new Error("Expected response data");
      }

      type Info = { messageId: string; createdAt: Date };
      const { messageId, createdAt }: Info = await res.json();

      onMessageSent({
        id: messageId,
        body: message,
        createdAt,
        senderId: userId,
      });
    },
    [conversationId, onMessageSent, session.data, session.status]
  );

  return (
    <div>
      {error && (
        <p className="text-red-600">Error sending message: {error.message}</p>
      )}
      <input
        type="text"
        className="mt-4 border-2 border-blue-300 disabled:border-gray-400 disabled:text-gray-400 w-full"
        placeholder="Say something..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={session.status === "loading"}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;

          e.preventDefault();

          const message = value.trim();
          if (!message) return;

          postMessage(message)
            .then(() => setError(null))
            .catch((err) => setError(err));

          setValue("");
        }}
      />
    </div>
  );
};

export default ExampleInput;
