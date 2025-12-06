import { Prisma } from "@prisma/client";

export type BookingWithUserShowMovie = Prisma.BookingGetPayload<{
  include: {
    user: true;
    show: {
      include: {
        movie: true;
      };
    };
  };
}>;
