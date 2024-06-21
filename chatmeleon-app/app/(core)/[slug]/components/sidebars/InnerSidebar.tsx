"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Conversation } from "@/types/conversation";
import UserList from "./UserList";
import ConversationList from "./ConversationList";
import { RouteKeys } from "@/types/route-key.d";

export default function InnerSidebar() {
  const pathName = usePathname();
  if (pathName.startsWith(`/${RouteKeys.Conversations}`)) {
    return (
      <aside
        className="
        fixed
        inset-y-0
        pb-20
        lg:pb-0
        lg:left-20
        lg:w-80
        lg:block
        overflow-y-auto
        border-r
        border-gray-200
        block
        w-full
        left-0
      "
      >
        <div className="px-5">
          <div className="flex-col">
            <div
              className="
              sticky
              top-0
              bg-white
              text-2xl
              font-bold
              text-neutral-800
              py-4
            "
            >
              Conversation
            </div>
            <ConversationList
              id={RouteKeys.Conversations}
              pageSize={15}
            ></ConversationList>
          </div>
        </div>
      </aside>
    );
  }
  if (pathName.startsWith(`/${RouteKeys.People}`)) {
    return (
      <aside
        className="
        fixed
        inset-y-0
        pb-20
        lg:pb-0
        lg:left-20
        lg:w-80
        lg:block
        overflow-y-auto
        border-r
        border-gray-200
        block
        w-full
        left-0
      "
      >
        <div className="px-5">
          <div className="flex-col">
            <div
              className="
              sticky
              top-0
              bg-white
              z-10
              text-2xl
              font-bold
              text-neutral-800
              py-4
            "
            >
              People
            </div>
            <UserList id={RouteKeys.People} pageSize={15} />
          </div>
        </div>
      </aside>
    );
  }

  return null;
}
