"use client";

import { useSocketWithStates } from "@/app/hook/socket";
import { FC, useEffect, useMemo, useRef, useState } from "react";

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

  const abortCtrlRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortCtrlRef.current?.abort();
    abortCtrlRef.current = new AbortController();

    const getMessagesURL = `${BACKEND_URL}/conversations/${conversationId}/messages`;
    const pageSize = 100; // fixed page size used for testing, no pagination

    fetch(`${getMessagesURL}?pageSize=${pageSize}`, {
      method: "GET",
      signal: abortCtrlRef.current.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          throw Error(await res.text());
        }
        if (!res.headers.get("Content-Type")?.includes("application/json")) {
          throw Error("Expected data");
        }

        // assume the data are the messages without validating
        const messages: Message[] = await res.json();
        setMessages(messages);
        setError(null);
      })
      .catch((err: Error /** assume type Error without validating */) => {
        if (err.name === "AbortError") return;

        setMessages(null);
        setError(err);
      });

    return () => abortCtrlRef.current?.abort();
  }, [conversationId]);

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
  // const { messages, error } = useMessages(conversationId);

  // FAKE DATA
  const error = null as Error | null;
  const messages = Array(10)
    .fill(
      JSON.parse(
        JSON.stringify([
          {
            id: 1,
            senderId: "1233",
            createdAt: new Date(),
            body: "Hello",
            image:
              "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.nj.com%2Fresizer%2Fmg42jsVYwvbHKUUFQzpw6gyKmBg%3D%2F1280x0%2Fsmart%2Fadvancelocal-adapter-image-uploads.s3.amazonaws.com%2Fimage.nj.com%2Fhome%2Fnjo-media%2Fwidth2048%2Fimg%2Fsomerset_impact%2Fphoto%2Fsm0212petjpg-7a377c1c93f64d37.jpg&f=1&nofb=1&ipt=62be44947434abb6e5b02218fb8bca1f8508a8bcab9cc8341cf8443d24ee2383&ipo=images",
          },
          { id: 2, senderId: "fasfw", createdAt: new Date(), body: "yo" },
        ])
      )
    )
    .flat() as Message[] | null;

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
        {senderId} ({createdAtString}): {body}
      </div>
      {image ? <img src={image} alt="Photo" width="20%" /> : null}
    </p>
  );
};

export default ExampleSocketChat;
