export default function InnerSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div>
        <p>this is an inner sidebar</p>
      </div>
      {children}
    </div>
  );
}
