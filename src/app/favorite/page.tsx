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
  const favorite = await getUserFavorites(userId);

  return (
    <div className="container-section relative py-10 min-h-[80vh]">
      <BlurCircle top="50px" left="0" />
      <BlurCircle bottom="50px" right="50px" />

      <h2 className="text-lg font-medium my-5">Your Favourite Movies</h2>

      {favorite.length ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
          {favorite.map((show, index) => (
            <MovieCard key={index} show={show} />
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
