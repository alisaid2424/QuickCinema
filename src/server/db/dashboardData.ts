import { cache } from "@/lib/cache";
import prisma from "@/lib/db";

export const getDashboardData = cache(
  async () => {
    // Paid bookings
    const bookings = await prisma.booking.findMany({
      where: {
        isPaid: true,
      },
      include: {
        user: true,
        show: {
          include: {
            movie: true,
          },
        },
      },
    });

    //Active shows (show date >= now)
    const activeShows = await prisma.show.findMany({
      where: {
        showDateTime: {
          gte: new Date(),
        },
      },
      include: {
        movie: true,
      },
    });

    // Total users
    const totalUser = await prisma.user.count();

    // Calculate statistics
    const dashboardData = {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
      activeShows,
      totalUser,
    };

    return dashboardData;
  },

  ["dashboard-data"],
  { revalidate: 3600 }
);
