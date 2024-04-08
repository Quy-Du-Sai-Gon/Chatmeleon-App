"use client";

import { useSocketWithStates } from "@/app/hook/socket";
import { FC } from "react";
import ExampleInput from "./input";
import { Message } from "./types";
import useMessages from "./useMessages";

/**
 * An example socket real-time chat component.
 */
const ExampleSocketChat = ({ conversationId }: { conversationId: string }) => {
  const { socket, id: socketId } = useSocketWithStates();
  const { messages, error, onNewMessage } = useMessages(conversationId);

  if (!messages && !error) {
    return <div>LOADING...</div>;
  }

  if (error) {
    return <div>ERROR: {error.message}</div>;
  }

  return (
    <div>
      <ul>
        {messages!.map((msg) => (
          <ExampleMessage key={msg.id} message={msg} />
        ))}
      </ul>

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
