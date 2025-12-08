import BlurCircle from "@/components/BlurCircle";
import DateSelect from "@/components/DateSelect";
import MovieCard from "@/components/MovieCard";
import { image_base_url } from "@/constants/enums";
import timeFormat from "@/lib/timeFormat";
import { getShow, getShows } from "@/server/db/shows";
import { PlayCircleIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToFavoriteButton from "./_components/AddToFavoriteButton";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { auth } from "@clerk/nextjs/server";

type PageProps = {
  params: Promise<{
    movieId: string;
  }>;
};

const MovieDetails = async ({ params }: PageProps) => {
  const { movieId } = await params;
  const shows = await getShows();
  const { movie, dateTime } = await getShow(movieId);

  if (!movie) {
    notFound();
  }

  const { userId } = await auth();
  let isFavorite = false;

  if (userId) {
    const user = await clerkClient.users.getUser(userId);
    const favorites = (user.privateMetadata?.favorites as string[]) || [];
    isFavorite = favorites.includes(movieId);
  }

  return (
    <div className="container-section pt-14 md:pt-32">
      <div className="flex flex-col md:flex-row gap-8">
        <Image
          src={image_base_url + (movie.posterPath ?? "")}
          alt={`img-${movie.title}`}
          width={400}
          height={500}
          className="max-md:mx-auto rounded-xl h-96 max-w-72 object-cover"
        />

        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-100px" left="-100px" />

          <p className="text-primary">ENGLISH</p>

          <h2 className="text-4xl font-semibold max-w-96 text-balance">
            {movie.title}
          </h2>

          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            {movie.voteAverage.toFixed(1)} User Rating
          </div>

          <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">
            {movie.overview}
          </p>

          <p className="max-sm:text-xs">
            {timeFormat(movie.runtime)} •
            {movie.genres.map((genre) => genre.name).join(",  ")} •{" "}
            {movie.releaseDate.split("-")[0]}
          </p>

          <div className="flex items-center flex-wrap gap-3 sm:gap-4 mt-4">
            <Link
              href="/#trailers"
              className="main-btn flex items-center gap-2 px-4 sm:px-7 bg-gray-800 hover:bg-gray-900"
            >
              <PlayCircleIcon className="w-5 h-5" /> Watch Trailer
            </Link>
            <Link href="#dateSelect" className="main-btn px-5 sm:px-10">
              Buy Tickets
            </Link>

            <AddToFavoriteButton
              movieId={movieId}
              initialFavorite={isFavorite}
            />
          </div>
        </div>
      </div>

      <p className="text-lg font-medium mt-20">Your Favorite Cast</p>

      <div className="overflow-x-auto mt-8 pb-4">
        <div className="flex items-center gap-4 w-max px-4">
          {movie.casts.slice(0, 12).map((cast, idx) => (
            <div key={idx} className="flex flex-col items-center gap-3">
              <Image
                src={image_base_url + (cast.profilePath ?? "")}
                alt={`img-${cast.name}`}
                width={200}
                height={200}
                className="h-20 w-20 rounded-full aspect-square object-cover"
              />

              <p className="text-xs font-medium">{cast.name}</p>
            </div>
          ))}
        </div>
      </div>

      <DateSelect dateTime={dateTime} id={movieId} />

      <p className="text-lg font-medium mt-20 mb-8">You Many Also Like</p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {shows.slice(0, 4).map((show, index) => (
          <MovieCard key={index} show={show} />
        ))}
      </div>

      <div className="flex justify-center my-20">
        <Link href="/movies" className="main-btn px-8">
          Show More
        </Link>
      </div>
    </div>
  );
};

export default MovieDetails;
