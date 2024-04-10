import { FC, useEffect, useRef } from "react";
import usePaginatedData from "./data-hook";
import Link from "next/link";

export type Conversation = {
  id: string;
  lastMessageId: string;
  name?: string;
  groupAvatar?: string;
  isGroup: boolean;
};

interface ExampleConversationsSidebarProps {
  selectedId?: string;
}

/**
 * Example sidebar showing a list of selectable conversation items.
 */
const ExampleConversationsSidebar: FC<ExampleConversationsSidebarProps> = ({
  selectedId,
}) => {
  const {
    data: conversations,
    error,
    onNewDatum: onNewConversation,
  } = usePaginatedData<Conversation>("/conversations");

  if (!conversations && !error) {
    return (
      <div className="flex flex-col h-screen justify-center items-center italic text-lg text-center">
        LOADING CONVERSATIONS...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen justify-center items-center text-red-600 font-semibold text-center">
        ERROR: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen py-2">
      <div className="text-lg font-bold mb-2">Conversations</div>

      <div className="overflow-y-auto flex-grow">
        {conversations!.length === 0 ? (
          <div className="font-mono">No conversation yet 😔</div>
        ) : (
          conversations!.map((convo) => (
            <ExampleConversationItem
              key={convo.id}
              conversation={convo}
              isSelected={convo.id === selectedId}
            />
          ))
        )}
      </div>
    </div>
  );
};

interface ExampleConversationItemProps {
  conversation: Conversation;
  isSelected?: boolean;
}

/**
 * A single conversation item display
 */
const ExampleConversationItem: FC<ExampleConversationItemProps> = ({
  conversation: { id, isGroup, groupAvatar, name },
  isSelected,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelected) {
      itemRef.current!.scrollIntoView({ behavior: "smooth" });
    }
  }, [isSelected]);

  const Avatar = () =>
    groupAvatar && (
      <img src={groupAvatar} alt="Group Photo" className="w-9 h-9" />
    );

  const Name = () => (name ? <span>{name}</span> : <em>{id}</em>);

  const GroupIndicator = () =>
    isGroup && <span className="font-semibold">(Group)</span>;

  return (
    <Link href={`/conversations/${id}`}>
      <div
        className={`border-2 ${
          !isSelected
            ? "border-gray-400 bg-gray-100 hover:border-blue-300 hover:bg-blue-100"
            : "border-slate-800 bg-slate-400"
        }`}
        ref={itemRef}
      >
        <Avatar /> <Name /> <GroupIndicator />
      </div>
    </Link>
  );
};

export default ExampleConversationsSidebar;
