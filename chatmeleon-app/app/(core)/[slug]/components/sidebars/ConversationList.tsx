import usePaginatedData from "@/app/hook/usePaginatedData";
import { ConversationChatList } from "@/types/conversation-chat-list";
import { useSession } from "next-auth/react";
import LoadingConversationList from "../loadings/LoadingConversationList";
import OriginalConversationItem from "./OriginalConversationItem";
import Link from "next/link";
import InfiniteScrollTrigger from "./InfiniteScrollTrigger";
import LoadingConversationInfiniteScroll from "../loadings/LoadingConversationInfiniteScroll";

interface ConversationListProps {
  id: string;
  pageSize: number;
}

const ConversationList: React.FC<ConversationListProps> = ({
  id,
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
  } = usePaginatedData<ConversationChatList>("/conversations", pageSize);

  if (sessionStatus === "loading") {
    return <LoadingConversationList />;
  }

  if (sessionStatus === "unauthenticated") {
    return <div>Please log in to see the conversations.</div>;
  }

  if (status === "loading") {
    return <LoadingConversationList />;
  }

  if (error) {
    return <div>Error fetching conversations</div>;
  }
  return (
    <div>
      {data.map((item) => (
        <Link
          key={item.id}
          href={
            item.id
              ? `/conversations/chat/${item.id}`
              : "/conversations/chat/new"
          }
        >
          <OriginalConversationItem key={item.id} conversation={item} />
        </Link>
      ))}
      {isFetchingNextPage && <LoadingConversationInfiniteScroll />}
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

export default ConversationList;
