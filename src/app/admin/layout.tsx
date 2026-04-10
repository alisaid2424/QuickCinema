import AdminNavbar from "./_components/AdminNavbar";
import AdminSidebar from "./_components/AdminSidebar";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <AdminNavbar />
      <div className="flex w-full overflow-hidden border-t border-gray-300/20">
        <AdminSidebar />
        <div className="flex-1 overflow-x-auto px-4 py-8 md:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
