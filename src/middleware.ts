import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Routes } from "./constants/enums";
import clerkClient from "@clerk/clerk-sdk-node";

const isProtected = createRouteMatcher(["/admin(.*)"]);

const UserRole = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (isProtected(req) && !userId) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (userId) {
    const pathname = req.nextUrl.pathname;
    const user = await clerkClient.users.getUser(userId);
    const role = user.publicMetadata.role as string | undefined;

    const isAdminRoute = pathname.startsWith(Routes.ADMIN);

    if (isAdminRoute && role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL(Routes.ROOT, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
