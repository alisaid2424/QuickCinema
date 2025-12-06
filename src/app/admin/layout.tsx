import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import AdminNavbar from "./_components/AdminNavbar";
import AdminSidebar from "./_components/AdminSidebar";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = await auth();
  if (!userId) return notFound();

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) return notFound();

  return (
    <div className="flex flex-col">
      <AdminNavbar />
      <div className="flex w-full overflow-hidden border-t border-gray-300/20">
        <AdminSidebar user={user} />
        <div className="flex-1 overflow-x-auto px-4 py-8 md:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
