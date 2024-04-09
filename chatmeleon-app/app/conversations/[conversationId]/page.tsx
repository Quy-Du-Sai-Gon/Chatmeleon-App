"use client";

import useConversations from "@/app/hook/useConversations";
import ExampleSocketChat from "./example/socket-real-time-chat";

const Conversations = () => {
  const { conversationId } = useConversations();

  return (
    <div className="hidden lg:block lg:pl-80">
      <div
        className=" 
        px-4
        sm:px-6
        lg:px-8
        h-auto
        bg-gray-100
      "
      >
        <ExampleSocketChat conversationId={conversationId} />
      </div>
    </div>
  );
};

export default Conversations;
