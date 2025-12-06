import AdminTable from "@/components/AdminTable";
import prisma from "@/lib/db";
import { getUsers } from "@/server/db/user";
import Title from "../_components/Title";

interface UsersPageProps {
  searchParams: Promise<{ pageNumber: string }>;
}

const UsersPage = async ({ searchParams }: UsersPageProps) => {
  const { pageNumber } = await searchParams;
  const page = Number(pageNumber) || 1;
  const users = await getUsers(page);
  const count: number = await prisma.user.count();

  const columns = [
    { key: "name", name: "UserName" },
    { key: "email", name: "Email" },
    { key: "image", name: "Image" },
    { key: "createdAt", name: "CreatedAt" },
    { key: "updatedAt", name: "UpdatedAt" },
  ];

  return (
    <>
      <Title text1="List" text2="Users" />

      <AdminTable
        data={users}
        columns={columns}
        pageNumber={pageNumber}
        totalCount={count}
        type="users"
      />
    </>
  );
};

export default UsersPage;
