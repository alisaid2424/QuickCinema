import { z } from "zod";

export const ShowSchema = z.object({
  movieId: z.string().min(1, "Please select a movie"),
  price: z
    .number()
    .refine((val) => val !== undefined, { message: "Show price is required" })
    .min(1, "Price must be at least 1"),
  times: z
    .array(
      z.object({
        date: z.string(),
        time: z.string(),
      })
    )
    .nonempty("Please add at least one date & time"),
});

export type TShowSchema = z.infer<typeof ShowSchema>;
