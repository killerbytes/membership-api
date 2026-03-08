import { z } from "zod";

export const LoginSchema = z.object({
  identifier: z.string({
    error: "Email or mobile number is required",
  }),
  password: z.string({
    error: "Password is required",
  }),
});

export const RefreshTokenSchema = z
  .object({
    refreshToken: z.string({
      error: "Refresh token is required",
    }),
  })
  .required({
    refreshToken: true,
  });
