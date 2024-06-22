"use client";

import Avatar from "@/app/(core)/components/avatars/Avatar";
import { UserPeopleList } from "@/types/people-user-list";
interface UserItemProps {
  user: UserPeopleList;
}

const UserItem: React.FC<UserItemProps> = ({ user }) => {
  return (
    <div
      className="
            w-full
            relative
            flex
            items-center
            space-x-3
            bg-white
            p-3
            hover:gb-neutral-100
            rounded-lg
            transition
            cursor-pointer
            "
    >
      <Avatar imageURL={user.image} />
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div
            className="
              flex
              justify-between
              items-center
              mb-1
            "
          >
            <p
              className="
                text-sm
                font-medium
                text-gray-900
              "
            >
              {user.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
