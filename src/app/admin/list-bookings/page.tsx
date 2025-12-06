import Title from "../_components/Title";
import AdminTable from "@/components/AdminTable";
import dateFormat from "@/lib/dateFormat";
import prisma from "@/lib/db";
import { formatCurrency } from "@/lib/formatters";
import { getAllBookings } from "@/server/db/bookings";

interface BookingsPageProps {
  searchParams: Promise<{ pageNumber: string }>;
}

const ListBookings = async ({ searchParams }: BookingsPageProps) => {
  const { pageNumber } = await searchParams;
  const page = Number(pageNumber) || 1;

  const bookings = await getAllBookings(page);
  const count = await prisma.booking.count();

  const columns = [
    { key: "userName", name: "User Name" },
    { key: "movieTitle", name: "Movie Name" },
    { key: "showTime", name: "Show Time" },
    { key: "seats", name: "Seats" },
    { key: "amountFormatted", name: "Amount" },
  ];

  const formattedBookings = bookings.map((item) => ({
    ...item,
    userName: item.user.name,
    movieTitle: item.show.movie.title,
    showTime: dateFormat(item.show.showDateTime),
    seats: item.bookedSeats.join(", "),
    amountFormatted: formatCurrency(item.amount),
  }));

  return (
    <>
      <Title text1="List" text2="Bookings" />

      <AdminTable
        data={formattedBookings}
        columns={columns}
        pageNumber={pageNumber}
        totalCount={count}
        type="list-bookings"
      />
    </>
  );
};

export default ListBookings;
