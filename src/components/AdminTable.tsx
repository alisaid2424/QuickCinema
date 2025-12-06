"use client";

import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Image from "next/image";
import { Edit } from "lucide-react";
import { UserRole } from "@prisma/client";

import {
  BOOKINGS_PER_PAGE,
  SHOWS_PER_PAGE,
  USERS_PER_PAGE,
} from "@/constants/enums";
import Pagination from "./Pagination";
import DeleteUserButton from "@/app/admin/users/_components/DeleteUserButton";
import LottieHandler from "./LottieHandler";
import DeleteShowButton from "@/app/admin/list-shows/_components/DeleteShowButton";
import DeleteBookingButton from "@/app/admin/list-bookings/_components/DeleteBookingButton";

interface AdminTableProps {
  data: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  columns: Array<{ key: string; name: string }>;
  pageNumber: string;
  totalCount: number;
  type: "users" | "list-shows" | "list-bookings";
}

const AdminTable: FC<AdminTableProps> = ({
  data,
  columns,
  pageNumber,
  totalCount,
  type,
}) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const currentPage = parseInt(pageNumber);

  const itemsPerPage =
    type === "users"
      ? USERS_PER_PAGE
      : type === "list-shows"
        ? SHOWS_PER_PAGE
        : BOOKINGS_PER_PAGE;

  const pages =
    type === "users"
      ? Math.ceil(totalCount / USERS_PER_PAGE)
      : type === "list-shows"
        ? Math.ceil(totalCount / SHOWS_PER_PAGE)
        : Math.ceil(totalCount / BOOKINGS_PER_PAGE);

  const handleDeleteSuccess = () => {
    const isLastItemOnPage = data.length === 1;
    if (isLastItemOnPage && currentPage > 1) {
      router.push(`/admin/${type}?pageNumber=${currentPage - 1}`);
    } else {
      startTransition(() => {
        router.refresh();
      });
    }
  };

  return data.length > 0 ? (
    <div className="max-w-full mt-6 overflow-x-auto">
      <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
        <thead>
          <tr className="bg-primary/20 text-left text-white">
            <th className="p-2 font-medium pl-5">#</th>

            {columns.map((column) => (
              <th key={column.key} className="p-2 font-medium capitalize">
                {column.name}
              </th>
            ))}
            <th className="p-2 font-medium">Actions</th>
          </tr>
        </thead>

        <tbody className="text-sm font-light">
          {data.map((item, index) => (
            <tr
              key={item.id}
              className="border-b border-primary/10 bg-primary/5 even:bg-primary/10"
            >
              <td className="p-2 pl-5">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </td>

              {columns.map((column) => {
                const value = item[column.key];

                // IMAGE HANDLING
                if (column.key === "image") {
                  return (
                    <td key={column.key} className="p-2">
                      {value ? (
                        <Image
                          src={value}
                          alt="image"
                          width={40}
                          height={40}
                          className="rounded-md object-cover bg-white"
                        />
                      ) : (
                        <Image
                          src="https://res.cloudinary.com/djhoc0ys4/image/upload/v1758875923/profile_images/img-profile-1.jpg.jpg"
                          alt="User image"
                          width={40}
                          height={40}
                          className="rounded-md object-cover"
                        />
                      )}
                    </td>
                  );
                }

                // ----- DATE HANDLING -----
                if (column.key === "createdAt" || column.key === "updatedAt") {
                  return (
                    <td key={column.key} className="p-2">
                      {new Date(value).toLocaleDateString()}
                    </td>
                  );
                }

                return (
                  <td key={column.key} className="p-2">
                    {value}
                  </td>
                );
              })}

              <td className="p-2">
                {type === "users" ? (
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/${type}/${item.clerkUserId}/edit`}
                      className="bg-green-600 p-2 rounded-md hover:bg-green-500 transition"
                    >
                      <Edit size={18} color="white" />
                    </Link>

                    {item.role !== UserRole.ADMIN && (
                      <DeleteUserButton
                        userId={item.clerkUserId}
                        onSuccess={handleDeleteSuccess}
                      />
                    )}
                  </div>
                ) : type === "list-shows" ? (
                  <DeleteShowButton
                    showId={item.id}
                    onSuccess={handleDeleteSuccess}
                  />
                ) : type === "list-bookings" ? (
                  <DeleteBookingButton
                    bookingId={item.id}
                    onSuccess={handleDeleteSuccess}
                  />
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        pageNumber={currentPage}
        pages={pages}
        route={`/admin/${type}`}
      />
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-[calc(100vh-72px)]">
      <LottieHandler type="empty" message={`No  ${type} found`} />
    </div>
  );
};

export default AdminTable;
