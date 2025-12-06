import Title from "../_components/Title";
import AdminTable from "@/components/AdminTable";
import dateFormat from "@/lib/dateFormat";
import { getAllShows, getShowsCount } from "@/server/db/shows";

interface ShowsPageProps {
  searchParams: Promise<{ pageNumber: string }>;
}

const ListShows = async ({ searchParams }: ShowsPageProps) => {
  const { pageNumber } = await searchParams;
  const page = Number(pageNumber) || 1;

  const shows = await getAllShows(page);
  const count = await getShowsCount();

  const columns = [
    { key: "movieTitle", name: "Movie Name" },
    { key: "showDateTime", name: "Show Time" },
    { key: "totalBookings", name: "Total Bookings" },
    { key: "earnings", name: "Earnings" },
  ];

  const formattedShows = shows.map((show) => {
    const occupiedSeats = (show.occupiedSeats ?? {}) as Record<string, string>;

    return {
      ...show,
      movieTitle: show.movie.title,
      showDateTime: dateFormat(show.showDateTime),
      totalBookings: Object.keys(occupiedSeats).length,
      earnings: Object.keys(occupiedSeats).length * (show.showPrice ?? 0),
    };
  });

  return (
    <>
      <Title text1="List" text2="Shows" />

      <AdminTable
        data={formattedShows}
        columns={columns}
        pageNumber={pageNumber}
        totalCount={count}
        type="list-shows"
      />
    </>
  );
};

export default ListShows;
