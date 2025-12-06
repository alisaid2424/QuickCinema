import { SHOWS_PER_PAGE } from "@/constants/enums";
import { cache } from "@/lib/cache";
import prisma from "@/lib/db";

export const getShow = cache(
  async (movieId: string) => {
    // Get shows
    const shows = await prisma.show.findMany({
      where: {
        movieId,
        showDateTime: { gte: new Date() },
      },
      orderBy: { showDateTime: "asc" },
    });

    // Get movie details
    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
      include: {
        genres: true,
        casts: true,
      },
    });

    const dateTime: Record<string, { time: Date; showId: string }[]> = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];

      if (!dateTime[date]) dateTime[date] = [];

      dateTime[date].push({
        time: show.showDateTime,
        showId: show.id,
      });
    });

    return {
      status: 200,
      movie,
      dateTime,
    };
  },

  [`getShow-${crypto.randomUUID()}`],
  { revalidate: 3600 }
);

export const getShows = cache(
  async () => {
    const shows = await prisma.show.findMany({
      where: {
        showDateTime: { gte: new Date() },
      },
      include: {
        movie: {
          include: {
            genres: true,
          },
        },
      },
      orderBy: { showDateTime: "asc" },
    });

    const uniqueMovies = Array.from(
      new Map(shows.map((s) => [s.movie.id, s])).values()
    );

    return uniqueMovies;
  },

  ["get-shows"],
  { revalidate: 3600 }
);

export const getAllShows = cache(
  async (pageNumber: number) => {
    const shows = await prisma.show.findMany({
      skip: SHOWS_PER_PAGE * (pageNumber - 1),
      take: SHOWS_PER_PAGE,
      where: {
        showDateTime: { gte: new Date() },
      },
      include: {
        movie: true,
      },
      orderBy: {
        showDateTime: "desc",
      },
    });

    return shows;
  },

  ["get-all-shows"],
  { revalidate: 3600 }
);

export const getShowsCount = async () => {
  return prisma.show.count({
    where: {
      showDateTime: { gte: new Date() },
    },
  });
};

export const getOccupiedSeats = cache(
  async (showId: string) => {
    const showData = await prisma.show.findUnique({
      where: { id: showId },
      select: {
        occupiedSeats: true,
      },
    });

    const occupiedSeats = Object.keys(showData?.occupiedSeats || {});

    return occupiedSeats;
  },

  ["getOccupiedSeats"],
  { revalidate: 3600 }
);
