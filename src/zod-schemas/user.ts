import { z } from "zod";

export const UpdateUserSchema = z.object({
  name: z
    .string()
    .optional()
    .refine((v) => v && v.trim().length > 0, {
      message: "Username is required",
    })
    .refine((v) => v!.length >= 3, {
      message: "Username should be at least 3 characters long",
    })
    .refine((v) => v!.length <= 50, {
      message: "Username should be less than 50 characters",
    }),

  email: z
    .string()
    .optional()
    .refine((v) => v && v.trim().length > 0, {
      message: "Email is required",
    })
    .refine((v) => v!.length >= 3, {
      message: "Email should be at least 3 characters long",
    })
    .refine((v) => v!.length <= 200, {
      message: "Email should be less than 200 characters",
    })
    .refine((v) => /\S+@\S+\.\S+/.test(v!), {
      message: "Email is not valid",
    }),

  phone: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        return /^\+?[1-9]\d{1,14}$/.test(value);
      },
      { message: "Please enter a valid phone number" }
    ),

  image: z.union([z.instanceof(File), z.string(), z.literal("")]).optional(),

  admin: z.boolean().optional(),
});

export type UpdateUserType = z.infer<typeof UpdateUserSchema>;
