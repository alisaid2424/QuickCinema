"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboardIcon,
  ListCollapseIcon,
  ListIcon,
  PlusSquareIcon,
  Users,
} from "lucide-react";
import { Routes } from "@/constants/enums";
import Image from "next/image";
import { User } from "@prisma/client";

const AdminSidebar = ({ user }: { user: User }) => {
  const pathname = usePathname();

  const tabs = [
    { title: "Dashboard", href: Routes.ADMIN, icon: LayoutDashboardIcon },
    { title: "Users", href: Routes.USERS, icon: Users },
    { title: "Add Shows", href: Routes.ADDSHOWS, icon: PlusSquareIcon },
    { title: "List Shows", href: Routes.LISTSHOWS, icon: ListIcon },
    {
      title: "List Bookings",
      href: Routes.LISTBOOKINGS,
      icon: ListCollapseIcon,
    },
  ];

  const isActiveTab = (href: string) => {
    const hrefArray = href.split("/");
    return hrefArray.length > 2 ? pathname.startsWith(href) : pathname === href;
  };

  return (
    <div className=" md:w-40 lg:w-64 w-16 border-r min-h-screen text-sm border-gray-300/20 pt-8 flex flex-col">
      <Image
        src={user.image ?? ""}
        alt="img-user"
        width={200}
        height={200}
        className="h-9 w-9 md:w-14 md:h-14 rounded-full mx-auto max-md:mb-4"
      />

      <p className="md:my-4 text-base max-md:hidden text-center">{user.name}</p>

      {tabs.map(({ title, href, icon: Icon }) => {
        const isActive = isActiveTab(href);

        return (
          <Link href={`${href}?pageNumber=1`} key={title}>
            <div
              className={`flex items-center text-gray-400 py-3 px-4 gap-3 transition-all ${
                isActive
                  ? "border-r-4 md:border-r-[6px] bg-primary/15 text-primary border-primary/90"
                  : " hover:bg-primary/15 hover:text-primary"
              }`}
            >
              <Icon className="w-5 h-5" />
              <p className="md:block hidden">{title}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default AdminSidebar;
