export default function Template({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="animate-in fade-in animation-duration-500">
      {children}
    </div>
  );
}
