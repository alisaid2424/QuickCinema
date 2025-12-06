"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { TShowSchema } from "@/zod-schemas/show";
import { TMDBMovieCredits, TMDBMovieDetails } from "@/types/movie";
import { Pages, Routes } from "@/constants/enums";
import { Prisma } from "@prisma/client";

export const addShow = async (data: TShowSchema) => {
  const { movieId, price, times } = data;

  try {
    // Check if movie exists
    let movie = await prisma.movie.findUnique({
      where: { tmdbId: movieId },
    });

    if (!movie) {
      const [movieRes, creditsRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`,
          },
        }),
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`,
          },
        }),
      ]);

      if (!movieRes.ok || !creditsRes.ok)
        throw new Error("Failed to fetch TMDB data");

      const movieApiData: TMDBMovieDetails = await movieRes.json();
      const movieCreditsData: TMDBMovieCredits = await creditsRes.json();

      // Create movie in DB
      movie = await prisma.movie.create({
        data: {
          tmdbId: movieId,
          title: movieApiData.title,
          overview: movieApiData.overview,
          posterPath: movieApiData.poster_path || "",
          backdropPath: movieApiData.backdrop_path || "",
          releaseDate: movieApiData.release_date,
          originalLanguage: movieApiData.original_language || "",
          tagline: movieApiData.tagline || "",
          voteAverage: movieApiData.vote_average,
          runtime: movieApiData.runtime,
          genres: {
            connectOrCreate: movieApiData.genres.map((g) => ({
              where: { name: g.name },
              create: { name: g.name },
            })),
          },
          casts: {
            connectOrCreate: movieCreditsData.cast.map((c) => ({
              where: { name: c.name },
              create: { name: c.name, profilePath: c.profile_path || "" },
            })),
          },
        },
      });
    }

    //Prepare available shows
    const showsToCreate: Prisma.ShowCreateManyInput[] = [];

    times.forEach((dateTime) => {
      const dateTimeString = `${dateTime.date}T${dateTime.time}`;
      showsToCreate.push({
        movieId: movie.id,
        showDateTime: new Date(dateTimeString),
        showPrice: price,
        occupiedSeats: {},
      });
    });

    //Add shows to the database
    if (showsToCreate.length > 0)
      await prisma.show.createMany({ data: showsToCreate });

    revalidatePath(Routes.LISTSHOWS);
    revalidatePath(Routes.LISTBOOKINGS);
    revalidatePath(Routes.ADMIN);
    revalidatePath(Routes.ROOT);
    revalidatePath(Pages.MOVIES);

    return { status: 201, message: "Show added successfully" };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "internal server error",
    };
  }
};

export const deleteShow = async (showId: string) => {
  try {
    const show = await prisma.show.findUnique({
      where: { id: showId },
      include: { movie: true },
    });

    if (!show) {
      return { status: 404, message: "Show not found" };
    }

    await prisma.show.delete({
      where: { id: showId },
    });

    revalidatePath(Routes.LISTSHOWS);
    revalidatePath(Routes.LISTBOOKINGS);
    revalidatePath(Routes.ADMIN);
    revalidatePath(Routes.ROOT);
    revalidatePath(Pages.MOVIES);

    return { status: 200, message: "Show deleted successfully" };
  } catch (error) {
    console.error("Delete show error:", error);
    return { status: 500, message: "Internal server error" };
  }
};
