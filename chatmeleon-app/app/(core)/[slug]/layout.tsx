"use client";
import ChatBox from "./components/chatbox/ChatBox";
import InnerSidebar from "./components/sidebars/InnerSidebar";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();

export default function CoreTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-full flex">
        <InnerSidebar />
        <div className="flex-1 ml-80">
          <ChatBox />
          {children}
        </div>
      </div>
    </QueryClientProvider>
  );
}
