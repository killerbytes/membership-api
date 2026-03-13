import { CookieOptions, NextFunction, Request, Response } from "express";
import * as userService from "../user/user.service";
import { LoginSchema } from "./auth.schema";
import * as authService from "./auth.service";

const env = process.env.NODE_ENV || "development";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env !== "development",
  sameSite: env !== "development" ? "none" : "lax",
  path: "/",
};

export async function login(req: Request, res: Response) {
  const { identifier, password } = req.body;
  const validatedData = LoginSchema.parse({
    identifier: identifier.trim(),
    password: password.trim(),
  });
  const { refreshToken, accessToken } = await authService.login(validatedData);

  res.cookie("refreshToken", refreshToken, cookieOptions);

  res.json({ accessToken });
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.cookies;
    // const validatedData = RefreshTokenSchema.parse({ refreshToken });
    const { refreshToken: newRefreshToken, accessToken } =
      await authService.refresh(refreshToken);
    res.cookie("refreshToken", newRefreshToken, cookieOptions);
    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response) {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    await authService.logout(refreshToken);
  }

  res.clearCookie("refreshToken", cookieOptions);
  res.json({ message: "Logged out successfully" });
}

export async function getCurrentUser(req: Request, res: Response) {
  if (!req.user?.id) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const user = await userService.get(req.user.id);
  res.json(user);
}
