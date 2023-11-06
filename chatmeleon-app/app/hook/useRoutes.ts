"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { signOut } from "next-auth/react";
import useConversations from "./useConversations";
import { HiChat, HiVideoCamera, HiHome } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";

const useRoutes = () => {
  const { pathname } = useParams();
  const { conversationId } = useConversations();

  const routes = useMemo(
    () => [
      {
        label: "Home",
        href: "/",
        icon: HiHome,
        active: pathname == "/",
      },
      {
        label: "Chat",
        href: "/conversations",
        icon: HiChat,
        active: pathname == "/conversations" || !!conversationId,
      },
      {
        label: "Video",
        href: "/video",
        icon: HiVideoCamera,
        active: pathname == "/video",
      },
      {
        label: "Users",
        href: "/users",
        icon: HiUsers,
        active: pathname == "/users",
      },
      {
        label: "Logout",
        href: "/auth",
        onClick: () => signOut(),
        icon: HiArrowLeftOnRectangle,
      },
    ],
    [pathname, conversationId]
  );

  return routes;
};

export default useRoutes;
