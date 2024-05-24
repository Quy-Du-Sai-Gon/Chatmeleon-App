import { useQuery } from "react-query";
import { PeopleUser } from "@/types/people-user";
import UserItem from "./UserItem";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { QueryClient } from "react-query";
const queryClient = new QueryClient();
interface UserListProps {
  id: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetchPeopleUsers = async (
  chatToken: string | undefined,
  pageNumber: number
): Promise<PeopleUser[]> => {
  const getMessageURL = `${BACKEND_URL}/users/search?pageSize=10&pageNumber=${pageNumber}`;

  try {
    const res = await fetch(getMessageURL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${chatToken}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      console.error("Error fetching users:", res.status);
      return [];
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

const UserList: React.FC<UserListProps> = ({ id }) => {
  const { data: userData } = useQuery(
    [id],
    async () => await fetchPeopleUsers(useSession().data?.chatToken, 1),
    {
      staleTime: 1000 * 60 * 5,
    }
  );

  if (!userData) {
    // Display a loading state or placeholder while userData is undefined
    return <div>Loading...</div>;
  }

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
              text-2xl
              font-bold
              text-neutral-800
              py-4
            "
          >
            People
          </div>
        </div>
        {userData.map((item) => (
          <Link
            key={item.userId}
            href={`/people/chat/${item.originalConversationId}`}
          >
            <UserItem key={item.userId} user={item} />
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default UserList;
