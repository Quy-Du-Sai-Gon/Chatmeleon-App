"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Conversation } from "@/types/conversation";
import UserList from "./UserList";
import ConversationList from "./ConversationList";
import { RouteKeys } from "@/types/route-key.d";

export default function InnerSidebar() {
  const pathName = usePathname();
  const [conversationData, setConversationData] = useState<Conversation[]>([]);
  RouteKeys;
  if (pathName.startsWith(`/${RouteKeys.Conversations}`)) {
    return (
      <ConversationList conversations={conversationData}></ConversationList>
    );
  }
  if (pathName.startsWith(`/${RouteKeys.People}`)) {
    return <UserList id={RouteKeys.People}></UserList>;
  }

  return null;
}
