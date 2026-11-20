import Layout from "./_components/Layout";
import { getOccupiedSeats, getShow } from "@/server/db/shows";

type PageProps = {
  params: Promise<{
    id: string;
    date: string;
  }>;
};

const SeatLayout = async ({ params }: PageProps) => {
  const { id, date } = await params;
  const { dateTime } = await getShow(id);

  const occupiedSeats = await getOccupiedSeats(dateTime[date][0].showId);

  return (
    <Layout date={date} occupiedSeats={occupiedSeats} dateTime={dateTime} />
  );
};

export default SeatLayout;
