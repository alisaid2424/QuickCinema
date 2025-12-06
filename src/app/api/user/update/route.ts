import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { UserRole } from "@prisma/client";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Routes } from "@/constants/enums";

export async function PATCH(req: Request) {
  try {
    const { userId: currentUserId } = await auth();

    if (!currentUserId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkUserId: currentUserId },
    });

    if (!currentUser) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const body = await req.json();

    const { targetUserId, name, phone, admin } = body;

    const isAdmin = currentUser.role === UserRole.ADMIN;
    const isSelf = currentUser.clerkUserId === targetUserId;

    if (!isAdmin && !isSelf) {
      return new Response(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
      });
    }

    if (!targetUserId || typeof targetUserId !== "string") {
      return new Response(JSON.stringify({ message: "Invalid target user" }), {
        status: 400,
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId: targetUserId },
    });

    if (!existingUser) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Sanitized fields
    const safePhone =
      typeof phone === "string" ? phone : existingUser.phone ?? "";

    const newRole =
      typeof admin === "boolean"
        ? admin
          ? UserRole.ADMIN
          : UserRole.USER
        : existingUser.role;

    // Name may not be provided (e.g. in checkout)
    let firstName = existingUser.name?.split(" ")[0] ?? "";
    let lastName = existingUser.name?.split(" ").slice(1).join(" ") ?? "";

    if (typeof name === "string" && name.trim().length > 0) {
      const parts = name.trim().split(" ");
      firstName = parts[0];
      lastName = parts.slice(1).join(" ");
    }

    // Update Clerk metadata safely
    await clerkClient.users.updateUser(targetUserId, {
      firstName,
      lastName,
      publicMetadata: {
        phone: safePhone,
        role: newRole,
      },
    });

    //  Update Prisma DB
    const updatedUser = await prisma.user.update({
      where: { clerkUserId: targetUserId },
      data: {
        name: `${firstName} ${lastName}`.trim(),
        phone: safePhone,
        role: newRole,
      },
    });

    revalidatePath(Routes.ADMIN);
    revalidatePath(Routes.USERS);
    revalidatePath(`${Routes.USERS}/${updatedUser.clerkUserId}/edit`);

    return new Response(
      JSON.stringify({
        message: "User updated successfully",
        user: updatedUser,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Update error:", err);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
