"use client";

import useConversations from "@/app/hook/useConversations";
import ExampleSocketChat from "./example/socket-real-time-chat";
import ExampleConversationsSidebar from "./example/socket-real-time-chat/conversations-sidebar";

const Conversations = () => {
  const { conversationId } = useConversations();

  return (
    <div className="flex justify-center">
      <div className="w-1/4 border-r-[1px]">
        <ExampleConversationsSidebar selectedId={conversationId} />
      </div>

      <div className=" flex-1 px-4 sm:px-6 lg:px-8 bg-gray-100 ">
        <ExampleSocketChat conversationId={conversationId} />
      </div>
    </div>
  );
};

export default Conversations;
