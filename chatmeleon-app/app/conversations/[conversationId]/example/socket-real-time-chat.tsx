"use client";

import { useSocketWithStates } from "@/app/hook/socket";
import { useSession } from "next-auth/react";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type Message = {
  id: string;
  body?: string;
  image?: string;
  createdAt: Date;
  senderId: string;
};

/**
 * Get messages of a conversation.
 */
const useMessages = (conversationId: string) => {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchMessages = useCallback(
    async (abortSignal: AbortSignal, chatToken: string | undefined) => {
      const getMessagesURL = `${BACKEND_URL}/conversations/${conversationId}/messages`;
      const pageSize = 100; // fixed page size used for testing, no pagination

      try {
        const res = await fetch(`${getMessagesURL}?pageSize=${pageSize}`, {
          method: "GET",
          signal: abortSignal,
          headers: chatToken
            ? {
                Authorization: `Bearer ${chatToken}`,
              }
            : undefined,
        });

        if (!res.ok) {
          throw new Error(await res.text());
        }

        if (!res.headers.get("Content-Type")?.includes("application/json")) {
          throw new Error("Expected data");
        }

        // assume the data are the messages without validating
        const messages: Message[] = await res.json();
        setMessages(messages);
        setError(null);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;

        setMessages(null);
        setError(err as Error);
      }
    },
    [conversationId]
  );

  const session = useSession();
  const chatToken = session.data?.chatToken;

  const abortCtrlRef = useRef<AbortController | null>(null);

  // Fetch the messages as an effect
  useEffect(() => {
    if (session.status === "loading") return;

    abortCtrlRef.current = new AbortController();

    fetchMessages(abortCtrlRef.current.signal, chatToken);

    return () => {
      abortCtrlRef.current?.abort();
      abortCtrlRef.current = null;
    };
  }, [chatToken, fetchMessages, session.status]);

  return useMemo(
    () => ({
      messages,
      error,
    }),
    [messages, error]
  );
};

/**
 * An example socket real-time chat component.
 */
const ExampleSocketChat = ({ conversationId }: { conversationId: string }) => {
  const { socket, id: socketId } = useSocketWithStates();
  const { messages, error } = useMessages(conversationId);

  if (!messages && !error) {
    return <div>LOADING...</div>;
  }

  if (error) {
    return <div>ERROR: {error.message}</div>;
  }

  return (
    <div>
      {messages!.map((msg) => (
        <ExampleMessage key={msg.id} message={msg} />
      ))}
    </div>
  );
};

/**
 * A single message display
 */
const ExampleMessage: FC<{
  message: Message;
}> = ({ message: { body, createdAt, senderId, image } }) => {
  const createdAtString = new Date(createdAt)
    // Data from json response without validation so could be string.
    // Call `new Date()` to convert.
    .toLocaleString();

  return (
    <p className="border-2 border-black">
      <div>
        {/**
         * NOTE: The current API does not return the name of the sender of a message.
         *
         * To show the name, either have a seperate API call to get the name,
         * or edit the current get messages API to also return the sender's name.
         *
         * For this example, let's only show the senderId.
         */}
        {senderId} ({createdAtString}): {body}
      </div>
      {image ? <img src={image} alt="Photo" width="20%" /> : null}
    </p>
  );
};

export default ExampleSocketChat;
