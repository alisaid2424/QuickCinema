import { Pages, Routes } from "@/constants/enums";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const auth = req.headers.get("Authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Allowed time: 60 minutes
  const TIMEOUT_MINUTES = 60;
  const expirationTime = new Date(Date.now() - TIMEOUT_MINUTES * 60 * 1000);

  // Get unpaid bookings that are more than 60 minutes old
  const bookings = await prisma.booking.findMany({
    where: {
      isPaid: false,
      createdAt: { lt: expirationTime },
    },
    include: {
      show: true,
    },
  });

  for (const booking of bookings) {
    const occupiedSeats = booking.show.occupiedSeats as Record<string, string>;

    // Remove seats associated with this booking
    booking.bookedSeats.forEach((seat) => {
      delete occupiedSeats[seat];
    });

    // updated show
    await prisma.show.update({
      where: { id: booking.showId },
      data: { occupiedSeats },
    });

    // delete booking
    await prisma.booking.delete({
      where: { id: booking.id },
    });

    // revalidation
    const dateKey = new Date(booking.show.showDateTime)
      .toISOString()
      .split("T")[0];

    revalidatePath(Routes.LISTSHOWS);
    revalidatePath(Routes.LISTBOOKINGS);
    revalidatePath(Pages.MYBOOKINGS);
    revalidatePath(`${Pages.SEATLAYOUT}/${booking.show.movieId}/${dateKey}`);
  }

  return NextResponse.json({
    status: 200,
    message: `Cleaned ${bookings.length} unpaid bookings`,
  });
}
