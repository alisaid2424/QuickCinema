import { Show, Movie, Genre } from "@prisma/client";

export type ShowWithMovie = Show & {
  movie: Movie & {
    genres: Genre[];
  };
};

export type MovieTMDB = {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

// TMDB Movie Details response type
export type TMDBMovieDetails = {
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  original_language: string;
  tagline: string | null;
  genres: { id: number; name: string }[];
  vote_average: number;
  runtime: number;
};

// TMDB Credits response type
export type TMDBMovieCredits = {
  cast: {
    name: string;
    character: string;
    profile_path: string | null;
  }[];
};
