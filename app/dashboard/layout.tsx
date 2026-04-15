import TopNav from "@/components/TopNav";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  return (
    <>
      <TopNav />
      <main className="page-wrap">{children}</main>
    </>
  );
}