"use client";

import usePaginatedData from "@/app/hook/usePaginatedData";
import { Message } from "@/types/message";
import { useSession } from "next-auth/react";
import React from "react";
import LoadingChatContent from "../loadings/LoadingChatContent";

interface ChatContentProps {
  conversationId: string | undefined;
  pageSize: number;
}

const ChatContent: React.FC<ChatContentProps> = ({
  conversationId,
  pageSize,
}) => {
  const { status: sessionStatus } = useSession();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = usePaginatedData<Message>(
    `/conversations/${conversationId}/messages`,
    pageSize
  );

  if (sessionStatus === "loading") {
    return <LoadingChatContent />;
  }

  if (sessionStatus === "unauthenticated") {
    return <div>Please log in to see the user list.</div>;
  }

  if (status === "loading") {
    return <LoadingChatContent />;
  }

  if (error) {
    return <div>Error fetching user data</div>;
  }
  return (
    <div>
      {/* Render your chat content here */}
      <h1>Chat Content for {conversationId}</h1>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
};

export default ChatContent;
