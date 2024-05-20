import InnerSidebar from "./components/sidebars/InnerSidebar";

export default function CoreTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full ">
      <InnerSidebar />
      {children}
    </div>
  );
}
