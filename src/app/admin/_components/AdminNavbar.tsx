import { BackButton } from "@/components/BackButton";
import Logo from "@/components/Logo";
import { Routes } from "@/constants/enums";
import Link from "next/link";

const AdminNavbar = () => {
  return (
    <div className="flex items-center justify-between py-5 px-6 md:px-10">
      <Link href={Routes.ROOT}>
        <Logo />
      </Link>

      <BackButton title="Go Back" variant="default" className="rounded-full" />
    </div>
  );
};

export default AdminNavbar;
