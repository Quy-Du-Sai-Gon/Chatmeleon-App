"use client";

import { FC, useEffect, useRef } from "react";
import ExampleInput from "./input";
import { Message } from "./types";
import usePaginatedData from "./data-hook";

/**
 * An example socket real-time chat component.
 */
const ExampleSocketChat = ({ conversationId }: { conversationId: string }) => {
  const {
    data: messages,
    error,
    onNewDatum: onNewMessage,
  } = usePaginatedData<Message>(`/conversations/${conversationId}/messages`);

  const messagesBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages && !error) {
    return (
      <div className="flex flex-col h-screen justify-center items-center italic text-lg text-center">
        LOADING MESSAGES...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen justify-center items-center text-red-600 font-semibold text-center">
        ERROR: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen py-6">
      <div className="overflow-y-auto flex-grow">
        {messages!.map((msg) => (
          <ExampleMessage key={msg.id} message={msg} />
        ))}

        <div ref={messagesBottomRef} />
      </div>

      <ExampleInput
        conversationId={conversationId}
        onMessageSent={onNewMessage}
      />
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
    <div className="border-2 border-black">
      <p>
        {/**
         * NOTE: The current API does not return the name of the sender of a message.
         *
         * To show the name, either have a seperate API call to get the name,
         * or edit the current get messages API to also return the sender's name.
         *
         * For this example, let's only show the senderId.
         */}
        {senderId} ({createdAtString}): {body}
      </p>
      {image ? <img src={image} alt="Photo" width="20%" /> : null}
    </div>
  );
};

export default ExampleSocketChat;
