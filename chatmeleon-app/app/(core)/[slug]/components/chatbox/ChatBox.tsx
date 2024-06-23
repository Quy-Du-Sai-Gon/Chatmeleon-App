import { usePathname } from "next/navigation";
import React from "react";
import EmptyState from "../EmptyState";
import ChatContent from "./ChatContent";

export default function ChatBox() {
  const pathName = usePathname();
  const conversationId = pathName.split("/").pop();

  // Check if pathName matches "/people", "/conversation", or any "/[slug]"
  if (pathName.match(/^\/[\w-]+$/)) {
    return <EmptyState />;
  }

  // Check if pathName matches "/people/chat/[conversationid]" or "/[slug]/chat/[conversationid]"
  if (pathName.match(/^\/[\w-]+\/chat\/[\w-]+$/)) {
    return (
      <div className="h-full flex bg-gray-100">
        <div className="flex-1">
          <ChatContent
            conversationId={conversationId}
            pageSize={5}
          ></ChatContent>
        </div>
      </div>
    );
  }

  // Default return (could handle other cases or provide a fallback)
  return null;
}
