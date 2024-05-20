import { PeopleUser } from "@/types/people-user";
import UserItem from "./UserItem";
import Link from "next/link";

interface UserListProps {
  users: PeopleUser[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
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
        {users.map((item) => (
          <Link
            key={item.originalConversationId}
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
