"use server";

import prisma from "@/lib/db";
import { Prisma, User } from "@prisma/client";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { revalidatePath } from "next/cache";
import { Pages, Routes } from "@/constants/enums";
import { auth } from "@clerk/nextjs/server";

export async function createUser(data: User) {
  try {
    const user = await prisma.user.create({ data });

    revalidatePath(Routes.ADMIN);
    revalidatePath(Routes.USERS);
    revalidatePath(`${Routes.USERS}/${user.clerkUserId}/edit`);

    return { user };
  } catch (error) {
    return { error };
  }
}

export async function UpdateUser(clerkUserId: string, data: Partial<User>) {
  try {
    if (!clerkUserId) {
      return { error: "Missing user ID" };
    }

    if (!data || Object.keys(data).length === 0) {
      return { error: "No data provided to update." };
    }

    const user = await prisma.user.update({
      where: { clerkUserId },
      data,
    });

    revalidatePath(Routes.ADMIN);
    revalidatePath(Routes.USERS);
    revalidatePath(`${Routes.USERS}/${user.clerkUserId}/edit`);

    return { user };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return { error: "User not found" };
      }
    }

    console.error("UpdateUser error:", error);
    return { error: "An error occurred while updating the user." };
  }
}

export async function deleteUser(clerkUserId: string) {
  try {
    //Delete from Clerk
    try {
      await clerkClient.users.deleteUser(clerkUserId);
    } catch (clerkError) {
      if (clerkError instanceof Error) {
        console.warn("Clerk deletion skipped or failed:", clerkError.message);
      } else {
        console.warn("Clerk deletion failed with unknown error:", clerkError);
      }
    }

    // Delete from DB
    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!existingUser) {
      return {
        status: 200,
        message: "User already deleted from DB.",
      };
    }

    await prisma.user.delete({
      where: { clerkUserId },
    });

    revalidatePath(Routes.LISTSHOWS);
    revalidatePath(Routes.LISTBOOKINGS);
    revalidatePath(Routes.ADMIN);
    revalidatePath(Routes.USERS);
    revalidatePath(Pages.MYBOOKINGS);
    revalidatePath(Routes.ROOT);

    return {
      status: 200,
      message: "User deleted successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "internal server error",
    };
  }
}

export async function updateFavoriteUser(movieId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        status: 401,
        message: "Unauthorized",
      };
    }

    const user = await clerkClient.users.getUser(userId);

    let favorites = (user.privateMetadata?.favorites as string[]) ?? [];

    if (!Array.isArray(favorites)) {
      favorites = [];
    }

    // Toggle logic
    if (!favorites.includes(movieId)) {
      favorites.push(movieId);
    } else {
      favorites = favorites.filter((id) => id !== movieId);
    }

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        ...user.privateMetadata,
        favorites,
      },
    });

    revalidatePath(Routes.ROOT);
    revalidatePath(Pages.FAVORITE);
    revalidatePath(Pages.MOVIES);

    return {
      status: 200,
      message: "Favorite movies updated",
      favorites,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "internal server error",
    };
  }
}
