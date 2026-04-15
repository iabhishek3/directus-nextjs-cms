export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", overflow: "auto" }}>
      {children}
    </div>
  );
}
