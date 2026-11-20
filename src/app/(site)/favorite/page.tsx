import BlurCircle from "@/components/BlurCircle";
import LottieHandler from "@/components/LottieHandler";
import MovieCard from "@/components/MovieCard";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserFavorites } from "@/server/db/user";
import { Pages } from "@/constants/enums";

const Favorite = async () => {
  const { userId } = await auth();
  if (!userId) redirect(Pages.LOGIN);
  const favoriteMovies = await getUserFavorites(userId);

  return (
    <div className="container-section relative py-20 min-h-dvh">
      <BlurCircle top="50px" left="0" />
      <BlurCircle bottom="50px" right="50px" />

      <h2 className="text-lg font-medium my-5">Your Favourite Movies</h2>

      {favoriteMovies.length ? (
        <div className="grid min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
          {favoriteMovies.map((movie) => (
            <MovieCard key={movie.id} show={movie} />
          ))}
        </div>
      ) : (
        <div className="element-center text-center min-h-[calc(100vh-76px)]">
          <LottieHandler type="empty" message="No Movies Available" />
        </div>
      )}
    </div>
  );
};

export default Favorite;
