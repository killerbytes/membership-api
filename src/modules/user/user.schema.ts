import { z } from "zod";

export const UserBaseSchema = z
  .object({
    email: z.string().email().optional(),
    mobile: z.string().optional(),
    password: z
      .string({
        error: "Password is required",
      })
      .min(8, "Password must be at least 8 characters long"),
    role: z.enum(["admin", "user"]).optional(),
    status: z.enum(["active", "inactive"]).optional(),
  })
  .required({
    password: true,
  })
  .refine((data) => data.email || data.mobile, {
    message: "Either email or mobile must be provided",
    path: ["email"],
  });
