import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { StarIcon } from "lucide-react";
import timeFormat from "@/lib/timeFormat";
import { ShowWithMovie } from "@/types/movie";
import { image_base_url } from "@/constants/enums";
import { Genre } from "@prisma/client";

const MovieCard = ({ show }: { show: ShowWithMovie }) => {
  return (
    <Link
      href={`/movie-details/${show.movie.id}`}
      className="w-80 sm:w-full mx-auto flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300"
    >
      <Image
        src={image_base_url + (show.movie.posterPath ?? "")}
        alt={`img-movie-${show.movie.title}`}
        width={400}
        height={400}
        className="rounded-lg h-52 w-full object-cover"
      />

      <p className="font-semibold mt-2 truncate">{show.movie.title}</p>

      <p className="text-xs mt-2 text-gray-400">
        {new Date(show.movie.releaseDate).getFullYear()} •{" "}
        {show.movie.genres
          .slice(0, 2)
          .map((genre: Genre) => genre.name)
          .join(" | ")}{" "}
        • {timeFormat(show.movie.runtime)}
      </p>

      <div className="flex items-center justify-between mt-4 pb-3">
        <Button className="rounded-full font-medium cursor-pointer text-white">
          Buy Tickets
        </Button>

        <p className="flex items-center gap-1 text-sm text-gray-400">
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {show.movie.voteAverage.toFixed(1)}
        </p>
      </div>
    </Link>
  );
};

export default MovieCard;
