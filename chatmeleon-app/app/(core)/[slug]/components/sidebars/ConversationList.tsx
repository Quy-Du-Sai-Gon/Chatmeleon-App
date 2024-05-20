import { Conversation } from "@/types/conversation";

interface UserListProps {
  conversations: Conversation[];
}

const ConversationList: React.FC<UserListProps> = ({ conversations }) => {
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
            Conversations
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ConversationList;
