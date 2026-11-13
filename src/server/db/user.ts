import { USERS_PER_PAGE } from "@/constants/enums";
import { cache } from "@/lib/cache";
import prisma from "@/lib/db";

export const getUsers = cache(
  async (pageNumber: number) => {
    const users = await prisma.user.findMany({
      skip: USERS_PER_PAGE * (pageNumber - 1),
      take: USERS_PER_PAGE,
      orderBy: { createdAt: "desc" },
    });

    return users;
  },
  ["users"],
  { revalidate: 3600 },
);

export const getUser = cache(
  async ({ id, clerkUserId }: { id?: string; clerkUserId?: string }) => {
    if (!id && !clerkUserId) throw new Error("id or clerkUserId is required");
    const query = id ? { id } : { clerkUserId };
    return await prisma.user.findUnique({ where: query });
  },
  [`user-${crypto.randomUUID()}`],
  { revalidate: 3600 },
);

export const getUserBookings = cache(
  async (clerkUserId: string) => {
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: user.id,
      },
      include: {
        user: true,
        show: {
          include: {
            movie: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return bookings;
  },

  ["get-user-bookings"],
  { revalidate: 3600 },
);

export const getUserFavorites = cache(
  async (clerkUserId: string) => {
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { id: true },
    });

    if (!dbUser) {
      return [];
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: dbUser.id,
      },
      include: {
        movie: {
          include: {
            genres: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!favorites.length) return [];

    const movieIds = favorites.map((fav) => fav.movieId);

    const shows = await prisma.show.findMany({
      where: {
        movieId: {
          in: movieIds,
        },
      },
      include: {
        movie: {
          include: {
            genres: true,
          },
        },
      },
    });

    const uniqueShows = Array.from(
      new Map(shows.map((s) => [s.movie.id, s])).values(),
    );

    return uniqueShows;
  },
  ["get-user-favorites"],
  { revalidate: 3600 },
);
