"use client";

import { Pages, Routes } from "@/constants/enums";
import { MenuIcon, SearchIcon, XIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

interface NavigationProps {
  isAdmin?: boolean;
}

const NAV_LINKS = [
  { title: "Home", href: Routes.ROOT },
  { title: "Movies", href: Pages.MOVIES },
  { title: "favorite", href: Pages.FAVORITE },
  { title: "Contact", href: Pages.CONTACT },
];

const AuthControls = dynamic(() => import("./AuthControls"), {
  ssr: false,
  loading: () => (
    <Button className="rounded-full text-white" disabled>
      Login
    </Button>
  ),
});

const Navigation = ({ isAdmin = false }: NavigationProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href;

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={`max-md:absolute max-md:top-0 max-md:start-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center gap-8 max-md:justify-center md:px-8 md:py-3 max-md:h-screen md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border md:border-gray-300/20 overflow-hidden ${
          isOpen
            ? "max-md:w-full max-md:visible"
            : "max-md:w-0 max-md:invisible"
        } transition-[width] duration-300`}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeMenu}
          className="md:hidden absolute top-6 right-6 cursor-pointer"
        >
          <XIcon className="w-6 h-6" />
        </button>

        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => {
              window.scrollTo(0, 0);
              closeMenu();
            }}
            className={`hover:text-primary transition ${
              isActive(link.href) ? "text-primary" : "text-accent"
            }`}
          >
            {link.title}
          </Link>
        ))}

        {isAdmin && (
          <Link
            href={Routes.ADMIN}
            onClick={closeMenu}
            className={`hover:text-primary transition ${
              pathname.startsWith(Routes.ADMIN) ? "text-primary" : "text-accent"
            }`}
          >
            Admin
          </Link>
        )}
      </nav>

      <div className="flex items-center gap-8">
        <SearchIcon
          aria-hidden="true"
          className="max-md:hidden w-6 h-6 cursor-pointer"
        />

        <AuthControls />
      </div>

      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className="max-md:ms-4 md:hidden cursor-pointer"
      >
        <MenuIcon className="w-8 h-8" />
      </button>
    </>
  );
};

export default Navigation;
