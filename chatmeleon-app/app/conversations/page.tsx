"use client";

import { signOut } from "next-auth/react";
import EmptyState from "../components/EmptyState";

const Conversations = () => {
  return (
    <div>
      <div className="hidden lg:block lg:pl-8 h-full">
        <EmptyState />
      </div>
    </div>
  );
};

export default Conversations;
