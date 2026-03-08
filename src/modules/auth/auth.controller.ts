import { CookieOptions, Request, Response } from "express";
import { LoginSchema, RefreshTokenSchema } from "./auth.schema";
import * as authService from "./auth.service";

const env = process.env.NODE_ENV || "development";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env !== "development",
  sameSite: env !== "development" ? "none" : "lax",
  path: "/",
};

export async function login(req: Request, res: Response) {
  const validatedData = LoginSchema.parse(req.body ?? {});
  const { refreshToken, accessToken } = await authService.login(validatedData);

  res.cookie("refreshToken", refreshToken, cookieOptions);

  res.json({ accessToken });
}

export async function refresh(req: Request, res: Response) {
  const validatedData = RefreshTokenSchema.parse(req.body ?? {});
  const { refreshToken, accessToken } =
    await authService.refresh(validatedData);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  res.json({ accessToken });
}
