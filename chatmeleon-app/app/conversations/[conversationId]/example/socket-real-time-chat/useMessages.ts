"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Message } from "./types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Get messages of a conversation.
 */
const useMessages = (conversationId: string) => {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const session = useSession();

  const fetchMessages = useCallback(
    async (abortSignal: AbortSignal) => {
      if (session.status !== "authenticated") {
        throw new Error("Unauthenticated");
      }

      const { chatToken } = session.data;

      const getMessagesURL = `${BACKEND_URL}/conversations/${conversationId}/messages`;
      const pageSize = 100; // fixed page size used for testing, no pagination

      const res = await fetch(`${getMessagesURL}?pageSize=${pageSize}`, {
        method: "GET",
        signal: abortSignal,
        headers: {
          Authorization: `Bearer ${chatToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      if (!res.headers.get("Content-Type")?.includes("application/json")) {
        throw new Error("Expected data");
      }

      // assume the data are the messages without validating
      const messages: Message[] = await res.json();

      return messages;
    },
    [conversationId, session.data, session.status]
  );

  const abortCtrlRef = useRef<AbortController | null>(null);

  // Fetch the messages as an effect
  useEffect(() => {
    setMessages(null);
    setError(null);

    if (session.status === "loading") return;

    abortCtrlRef.current = new AbortController();

    fetchMessages(abortCtrlRef.current.signal)
      .then((messages) => {
        setMessages(messages.toReversed());
        setError(null);
      })
      .catch((err: Error) => {
        if (err.name === "AbortError") return;

        setMessages(null);
        setError(err);
      });

    return () => {
      abortCtrlRef.current?.abort();
      abortCtrlRef.current = null;
    };
  }, [fetchMessages, session.status]);

  const onNewMessage = useCallback(
    (msg: Message) => setMessages((msgs) => (msgs ? [...msgs, msg] : [msg])),
    []
  );

  return useMemo(
    () => ({
      messages,
      error,
      onNewMessage,
    }),
    [messages, error, onNewMessage]
  );
};

export default useMessages;
