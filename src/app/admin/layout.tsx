import AdminNavbar from "./_components/AdminNavbar";
import AdminSidebar from "./_components/AdminSidebar";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AdminNavbar />
      <div className="flex w-full border-t border-gray-300/20 flex-1 overflow-hidden">
        <AdminSidebar />

        <div className="flex-1 overflow-auto px-4 py-8 md:px-10 h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
