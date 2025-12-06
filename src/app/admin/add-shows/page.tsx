import { getNowPlayingMovies } from "@/server/db/movies";
import Title from "../_components/Title";
import AddShowForm from "./_components/AddShowForm";

const AddShows = async () => {
  const getMovies = await getNowPlayingMovies();

  return (
    <>
      <Title text1="Add" text2="Shows" />

      <p className="mt-10 text-lg font-medium">Now Playing Movies</p>

      <AddShowForm movies={getMovies} />
    </>
  );
};

export default AddShows;
