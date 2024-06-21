import { Conversation } from "@/types/conversation";

interface UserListProps {
  conversations: Conversation[];
}

const ConversationList: React.FC<UserListProps> = ({ conversations }) => {
  return <div>x</div>;
};

export default ConversationList;
