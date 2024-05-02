import EmptyState from "../components/EmptyState";
import ExampleConversationsSidebar from "./[conversationId]/example/socket-real-time-chat/conversations-sidebar";

const Conversations = () => {
  return (
    <div className="flex justify-center">
      <div className="w-1/4 border-r-[1px]">
        <ExampleConversationsSidebar />
      </div>

      <div className=" flex-1 px-4 sm:px-6 lg:px-8 bg-gray-100 ">
        <EmptyState />
      </div>
    </div>
  );
};

export default Conversations;
