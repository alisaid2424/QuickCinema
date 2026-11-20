import { Routes } from "@/constants/enums";
import { auth } from "@clerk/nextjs/server";
import { UserRole } from "@prisma/client";
import Link from "next/link";
import Logo from "../Logo";
import Navigation from "./Navigation";

const Header = async () => {
  const { sessionClaims } = await auth();
  const metadata = sessionClaims?.publicMetadata as
    { role?: string } | undefined;
  const role = metadata?.role;
  const isAdmin = role === UserRole.ADMIN;

  return (
    <header className="container-section fixed top-0 left-0 w-full z-50 bg-transparent flex items-center justify-between py-5">
      <Link href={Routes.ROOT} className="max-md:flex-1">
        <Logo />
      </Link>

      <Navigation isAdmin={isAdmin} />
    </header>
  );
};

export default Header;
