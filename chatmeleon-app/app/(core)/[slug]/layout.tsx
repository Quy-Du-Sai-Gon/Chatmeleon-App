"use client";
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
      <div className="h-full ">
        <InnerSidebar />
        {children}
      </div>
    </QueryClientProvider>
  );
}
