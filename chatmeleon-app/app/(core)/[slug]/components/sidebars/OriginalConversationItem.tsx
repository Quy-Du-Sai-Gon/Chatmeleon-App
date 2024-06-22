"use client";

import Avatar from "@/app/(core)/components/avatars/Avatar";
import { ConversationChatList } from "@/types/conversation-chat-list";
import { useState } from "react";
import { formatTimeAgo } from "@/app/libs/dateTimeUtils";
interface OriginalConversationItemProps {
  conversation: ConversationChatList;
}

const OriginalConversationItem: React.FC<OriginalConversationItemProps> = ({
  conversation,
}) => {
  const [lastMessage, setLastMessage] = useState(conversation.lastMessage);

  return (
    <div
      className="
        w-full
        relative
        flex
        items-center
        space-x-3
        bg-white
        p-3
        hover:bg-gray-100
        rounded-lg
        transition
        cursor-pointer
      "
    >
      <Avatar imageURL={conversation.image} />
      {/* Assuming conversation.user contains user information */}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-900">
              {conversation.name ? conversation.name : "Chatmeleon User"}
            </p>
          </div>
          <p
            className="text-sm text-gray-500"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {lastMessage?.sender.name}: {lastMessage?.body}
          </p>
          <p className="text-xs text-gray-500">
            {lastMessage?.createdAt
              ? formatTimeAgo(new Date(lastMessage?.createdAt))
              : "undefined"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OriginalConversationItem;
