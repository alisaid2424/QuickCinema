"use server";

import { Pages, Routes } from "@/constants/enums";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const createBooking = async ({
  clerkUserId,
  showId,
  selectedSeats,
}: {
  clerkUserId: string;
  showId: string;
  selectedSeats: string[];
}) => {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    const showData = await prisma.show.findUnique({
      where: { id: showId },
      include: { movie: true },
    });

    if (!showData) {
      throw new Error("Show not found.");
    }

    const occupiedSeats =
      (showData.occupiedSeats as Record<string, string>) ?? {};

    //Check if any seat is pre-booked
    const isSeatTaken = selectedSeats.some(
      (seat: string) => occupiedSeats[seat]
    );

    if (isSeatTaken) {
      throw new Error("Selected Seats are not available.");
    }

    //Create a new booking
    const data = await prisma.booking.create({
      data: {
        userId: user?.id,
        showId,
        amount: showData.showPrice * selectedSeats.length,
        bookedSeats: selectedSeats,
      },
    });

    //Update on reserved seats
    const updatedOccupiedSeats = { ...occupiedSeats };
    selectedSeats.forEach((seat: string) => {
      updatedOccupiedSeats[seat] = user?.id;
    });

    await prisma.show.update({
      where: { id: showId },
      data: {
        occupiedSeats: updatedOccupiedSeats,
      },
    });

    const dateKey = new Date(showData.showDateTime).toISOString().split("T")[0];

    revalidatePath(Routes.LISTSHOWS);
    revalidatePath(Routes.LISTBOOKINGS);
    revalidatePath(Routes.ADMIN);
    revalidatePath(Pages.MYBOOKINGS);
    revalidatePath(`${Pages.SEATLAYOUT}/${showData.movie.id}/${dateKey}`);

    return {
      status: 201,
      message:
        "Your reservation is made. Please complete payment within one hour to confirm, otherwise it will be canceled.",
      data,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "internal server error",
    };
  }
};

export const updateBookingPayment = async (bookingId: string) => {
  try {
    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { isPaid: true },
      include: {
        user: true,
        show: {
          include: {
            movie: true,
          },
        },
      },
    });

    revalidatePath(Routes.LISTSHOWS);
    revalidatePath(Routes.LISTBOOKINGS);
    revalidatePath(Routes.ADMIN);
    revalidatePath(Pages.MYBOOKINGS);

    return updated;
  } catch (error) {
    console.error("Update booking payment failed:", error);
    return { status: 500, message: "Update failed" };
  }
};

export const deleteBooking = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { show: true },
  });

  if (!booking) return;

  const occupiedSeats = booking.show.occupiedSeats as Record<string, string>;

  // Delete the seats booked
  booking.bookedSeats.forEach((seat) => {
    delete occupiedSeats[seat];
  });

  const showData = await prisma.show.update({
    where: { id: booking.showId },
    data: { occupiedSeats },
    include: {
      movie: true,
    },
  });

  // Delete booking
  await prisma.booking.delete({
    where: { id: bookingId },
  });

  const dateKey = new Date(showData.showDateTime).toISOString().split("T")[0];

  revalidatePath(Routes.LISTSHOWS);
  revalidatePath(Routes.LISTBOOKINGS);
  revalidatePath(Routes.ADMIN);
  revalidatePath(Pages.MYBOOKINGS);
  revalidatePath(`${Pages.SEATLAYOUT}/${showData.movie.id}/${dateKey}`);

  return { status: 200, message: "Booking deleted and seats freed." };
};
