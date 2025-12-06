import BlurCircle from "@/components/BlurCircle";
import { image_base_url, Pages } from "@/constants/enums";
import dateFormat from "@/lib/dateFormat";
import { formatCurrency } from "@/lib/formatters";
import timeFormat from "@/lib/timeFormat";
import { getUserBookings } from "@/server/db/user";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import LottieHandler from "@/components/LottieHandler";
import Link from "next/link";

const MyBookings = async () => {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) redirect(Pages.LOGIN);

  const bookings = await getUserBookings(clerkUserId);

  return (
    <div className="relative container-section py-10 min-h-[100vh]">
      <BlurCircle top="100px" left="100px" />

      <div>
        <BlurCircle bottom="0px" left="600px" />
      </div>

      {bookings.length ? (
        <>
          <h2 className="text-lg font-semibold mb-4">My Bookings</h2>

          {bookings.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl"
            >
              <div className="flex flex-col md:flex-row">
                <Image
                  src={image_base_url + item.show.movie.posterPath}
                  alt={`img-${item.show.movie.title}`}
                  className="md:max-w-44 aspect-video h-auto object-cover object-bottom rounded"
                  width={300}
                  height={200}
                />
                <div className="flex flex-col p-3">
                  <p className="text-lg font-semibold">
                    {item.show.movie.title}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {timeFormat(item.show.movie.runtime)}
                  </p>
                  <p className="text-gray-400 text-sm mt-auto">
                    {dateFormat(item.show.showDateTime)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:items-end md:text-right justify-between p-3">
                <div className="flex items-center gap-4">
                  <p className="text-2xl font-semibold mb-3">
                    {formatCurrency(item.amount)}
                  </p>
                  {!item.isPaid && (
                    <Link
                      href={`/checkout?amount=${item.amount}&bookingId=${item.id}`}
                      className="bg-primary hover:bg-primary-foreground transition-colors py-1.5 px-3 rounded-full mb-3 text-sm font-medium"
                    >
                      Pay Now
                    </Link>
                  )}
                </div>

                <div className="text-sm">
                  <p className="my-2">
                    <span className="text-gray-400">Total Tickets: </span>
                    {item.bookedSeats.length}
                  </p>
                  <p>
                    <span className="text-gray-400">Seat Number: </span>
                    {item.bookedSeats.join(",  ")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="element-center text-center min-h-[calc(100vh-76px)]">
          <LottieHandler type="empty" message="No Bookings Available" />
        </div>
      )}
    </div>
  );
};

export default MyBookings;
