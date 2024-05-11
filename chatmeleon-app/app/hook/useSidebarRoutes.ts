import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { signOut } from "next-auth/react";
import useConversations from "./useConversations";

import { HiChat } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";

const useSidebarRoutes = () => {
  const { pathname } = useParams();
  const { conversationId } = useConversations();

  const routes = useMemo(
    () => [
      {
        label: "Chat",
        href: "/conversations",
        icon: HiChat,
        active: pathname == "/conversations" || !!conversationId,
      },
      {
        label: "People",
        href: "/people",
        icon: HiUsers,
        active: pathname == "/people",
      },
      {
        label: "Logout",
        href: "#",
        onClick: () => signOut(),
        icon: HiArrowLeftOnRectangle,
      },
    ],
    [pathname, conversationId]
  );

  return routes;
};

export default useSidebarRoutes;
