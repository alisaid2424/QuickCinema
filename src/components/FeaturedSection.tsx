import { Pages } from "@/constants/enums";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import BlurCircle from "./BlurCircle";
import MovieCard from "./MovieCard";
import LottieHandler from "./LottieHandler";
import { getShows } from "@/server/db/shows";

const FeaturedSection = async () => {
  const shows = await getShows();

  return (
    <div className="container-section overflow-hidden">
      <div className="relative flex items-center justify-between pt-20 pb-10">
        <BlurCircle top="50px" right="-50px" />
        <p className="font-medium text-lg text-gray-300">Now Showing</p>

        <Link
          href={Pages.MOVIES}
          className="group flex items-center gap-2 text-sm text-gray-300"
        >
          View All
          <ArrowRight className="group-hover:translate-x-1 w-4 h-4 transition" />
        </Link>
      </div>
      {shows.length ? (
        <>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 my-7 pb-8 w-full">
            {shows.map((show, index) => (
              <MovieCard key={index} show={show} />
            ))}
          </div>
          <div className="flex justify-center mt-20 pb-5">
            <Link
              href={Pages.MOVIES}
              className="main-btn rounded-md min-w-[170px] text-center"
            >
              Show More
            </Link>
          </div>
        </>
      ) : (
        <div className="w-full max-w-xs mx-auto py-5 mb-7">
          <LottieHandler type="empty" message="No Movies Available" />
        </div>
      )}
    </div>
  );
};

export default FeaturedSection;
