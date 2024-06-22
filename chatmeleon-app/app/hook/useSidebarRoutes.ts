import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import useConversations from "./useConversations";

import { HiChat } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";
import { RouteKeys } from "@/types/route-key.d";

const useSidebarRoutes = () => {
  const pathName = usePathname();
  const { conversationId } = useConversations();

  const routes = useMemo(
    () => [
      {
        label: "Chat",
        href: `/${RouteKeys.Conversations}`,
        icon: HiChat,
        active: pathName.includes(`/${RouteKeys.Conversations}`),
      },
      {
        label: "People",
        href: `/${RouteKeys.People}`,
        icon: HiUsers,
        active: pathName.includes(`/${RouteKeys.People}`),
      },
      {
        label: "Logout",
        href: "#",
        onClick: () => signOut(),
        icon: HiArrowLeftOnRectangle,
      },
    ],
    [pathName, conversationId]
  );

  return routes;
};

export default useSidebarRoutes;
