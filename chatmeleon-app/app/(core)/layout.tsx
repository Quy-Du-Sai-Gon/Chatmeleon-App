import Sidebar from "./components/sidebars/Sidebar";
import { SocketProvider } from "../context/SocketContext";

export default async function CoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketProvider>
      <Sidebar>
        <div className="h-full">{children}</div>
      </Sidebar>
    </SocketProvider>
  );
}
