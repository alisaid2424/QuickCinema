import BlurCircle from "@/components/BlurCircle";
import LottieHandler from "@/components/LottieHandler";
import MovieCard from "@/components/MovieCard";
import { getShows } from "@/server/db/shows";

const MoviesPage = async () => {
  const shows = await getShows();

  return shows.length ? (
    <div className="container-section relative my-14 min-h-[80vh]">
      <BlurCircle top="50px" left="0" />
      <BlurCircle bottom="50px" right="50px" />

      <h2 className="text-lg font-medium my-5">Now Showing</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
        {shows.map((show, index) => (
          <MovieCard key={index} show={show} />
        ))}
      </div>
    </div>
  ) : (
    <div className="element-center text-center min-h-[calc(100vh-76px)]">
      <LottieHandler type="empty" message="No Movies Available" />
    </div>
  );
};

export default MoviesPage;
