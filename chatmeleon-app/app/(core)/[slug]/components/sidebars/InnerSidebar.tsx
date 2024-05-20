"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import usePeopleUsers from "@/app/hook/usePeopleUsers";
import { useEffect, useState } from "react";
import { PeopleUser } from "@/types/people-user";
import { Conversation } from "@/types/conversation";
import UserList from "./UserList";
import ConversationList from "./ConversationList";

export default function InnerSidebar() {
  const pathName = usePathname();
  const session = useSession();
  const chatToken = session.data?.chatToken;
  const [userData, setUserData] = useState<PeopleUser[]>([]);
  const [conversationData, setConversationData] = useState<Conversation[]>([]);

  if (pathName.startsWith("/conversations")) {
    return (
      <ConversationList conversations={conversationData}></ConversationList>
    );
  }

  if (pathName.startsWith("/people")) {
    useEffect(() => {
      const fetchData = async () => {
        console.log("Fetching user data");
        if (userData.length === 0) {
          console.log("Data is empty so now fetching");
          const users = await usePeopleUsers(chatToken, "1");
          setUserData(users);
        }
      };
      fetchData();
    }, [chatToken]);

    return <UserList users={userData}></UserList>;
  }

  return null;
}
