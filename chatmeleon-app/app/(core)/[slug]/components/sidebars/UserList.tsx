import { useSession } from "next-auth/react";
import Link from "next/link";
import { PeopleUser } from "@/types/people-user";
import UserItem from "./UserItem";
import LoadingUserList from "../loadings/LoadingUserList";
import usePaginatedData from "@/app/hook/usePaginatedData";
import InfiniteScrollTrigger from "./InfiniteScrollTrigger"; // Import the InfiniteScrollTrigger component
import LoadingUserInfiniteScroll from "../loadings/LoadingUserInfiniteScroll";

interface UserListProps {
  id: string;
  pageSize: number;
}

const UserList: React.FC<UserListProps> = ({ id, pageSize }) => {
  const { status: sessionStatus } = useSession();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = usePaginatedData<PeopleUser>("/users/search", pageSize);

  if (sessionStatus === "loading") {
    return <LoadingUserList />;
  }

  if (sessionStatus === "unauthenticated") {
    return <div>Please log in to see the user list.</div>;
  }

  if (status === "loading") {
    return <LoadingUserList />;
  }

  if (error) {
    return <div>Error fetching user data</div>;
  }

  return (
    <div>
      {data.map((item) => (
        <Link
          key={item.id}
          href={
            item.originalConversationId
              ? `/people/chat/${item.originalConversationId}`
              : "/people/chat/new"
          }
        >
          <UserItem key={item.id} user={item} />
        </Link>
      ))}
      {isFetchingNextPage && <LoadingUserInfiniteScroll />}
      <InfiniteScrollTrigger
        onVisible={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        isLoading={isFetchingNextPage}
      />
    </div>
  );
};

export default UserList;
