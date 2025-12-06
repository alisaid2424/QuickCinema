import { BOOKINGS_PER_PAGE } from "@/constants/enums";
import { cache } from "@/lib/cache";
import prisma from "@/lib/db";

export const getAllBookings = cache(
  async (pageNumber: number) => {
    const bookings = await prisma.booking.findMany({
      skip: BOOKINGS_PER_PAGE * (pageNumber - 1),
      take: BOOKINGS_PER_PAGE,
      include: {
        user: true,
        show: {
          include: {
            movie: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return bookings;
  },

  ["get-all-bookings"],
  { revalidate: 3600 }
);
