import { cache } from "@/lib/cache";

export const getNowPlayingMovies = cache(
  async () => {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data from TMDB");
    }

    const data = await response.json();

    return data.results;
  },
  ["now_playing_movies"],
  { revalidate: 3600 }
);
