import DashboardHeader from "./_components/DashboardHeader";
import SideNavBar from "./_components/SideNavBar";

function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="hidden md:block md:w-64 h-screen bg-slate-50 fixed">
        <SideNavBar />
      </div>
      <div className="md:ml-64">
        <DashboardHeader />
        {children}
        </div>
    </div>
  );
}
export default DashboardLayout;
