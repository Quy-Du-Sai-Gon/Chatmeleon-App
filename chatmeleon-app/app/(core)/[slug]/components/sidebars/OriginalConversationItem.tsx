"use client";

import Avatar from "@/app/(core)/components/avatars/Avatar";
import { Conversation } from "@/types/conversation";

interface OriginalConversationItemProps {
  conversation: Conversation;
}

const OriginalConversationItem: React.FC<OriginalConversationItemProps> = ({
  conversation,
}) => {
  // Mock data for demonstration purposes
  const lastMessage = "Hey! How are you?";
  const timestamp = new Date().toLocaleString(); // Replace with actual timestamp logic

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
      <Avatar user={conversation} />{" "}
      {/* Assuming conversation.user contains user information */}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-900">
              {conversation.id}
            </p>
          </div>
          <p className="text-sm text-gray-500">{lastMessage}</p>
          <p className="text-xs text-gray-500">{timestamp}</p>
        </div>
      </div>
    </div>
  );
};

export default OriginalConversationItem;
