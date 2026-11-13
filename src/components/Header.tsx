"use client";

import { Pages, Routes } from "@/constants/enums";
import Link from "next/link";
import Logo from "./Logo";
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";
import { UserRole } from "@prisma/client";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { title: "Home", href: Routes.ROOT },
    { title: "Movies", href: Pages.MOVIES },
    { title: "favorite", href: Pages.FAVORITE },
    { title: "Contact", href: Pages.CONTACT },
  ];

  const isAdmin = user?.publicMetadata.role === UserRole.ADMIN;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href;

  return (
    !pathname.startsWith(Routes.ADMIN) && (
      <header className="fixed top-0 left-0 w-full z-50 bg-transparent">
        <div className="container-section flex items-center justify-between py-5">
          <Link href={Routes.ROOT} className="max-md:flex-1">
            <Logo />
          </Link>

          <div
            className={`max-md:absolute max-md:top-0 max-md:start-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center gap-8 max-md:justify-center md:px-8 md:py-3 max-md:h-screen md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border md:border-gray-300/20 overflow-hidden ${
              isOpen
                ? "max-md:w-full max-md:visible"
                : "max-md:w-0 max-md:invisible"
            } transition-[width] duration-300`}
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setIsOpen(false)}
              className="md:hidden absolute top-6 right-6 cursor-pointer"
            >
              <XIcon className="w-6 h-6" />
            </button>

            {links.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                onClick={() => {
                  scrollTo(0, 0);
                  setIsOpen(false);
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
                onClick={() => setIsOpen(false)}
                href={Routes.ADMIN}
                className={` hover:text-primary transition ${
                  pathname.startsWith(Routes.ADMIN)
                    ? "text-primary"
                    : "text-accent"
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-8">
            <SearchIcon
              aria-hidden="true"
              className="max-md:hidden w-6 h-6 cursor-pointer"
            />

            {user ? (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="My Bookings"
                    labelIcon={<TicketPlus className="w-4 h-4 text-gray-600" />}
                    onClick={() => router.push(Pages.MYBOOKINGS)}
                  />
                </UserButton.MenuItems>
              </UserButton>
            ) : (
              <Button
                onClick={() =>
                  openSignIn({
                    appearance: {
                      elements: {
                        modalContent: "mx-auto my-auto",
                      },
                    },
                  })
                }
                className="rounded-full text-white hover:bg-primary/90 transition-colors duration-300"
              >
                Login
              </Button>
            )}
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
        </div>
      </header>
    )
  );
};

export default Header;
