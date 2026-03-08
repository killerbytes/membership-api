import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { z } from "zod";
import { User } from "../user/user.model";
import { LoginSchema, RefreshTokenSchema } from "./auth.schema";

const JWT_SECRET = process.env.JWT_SECRET || "access_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export async function login(data: z.infer<typeof LoginSchema>) {
  const user = await User.scope("withPassword").findOne({
    where: {
      [Op.or]: [{ email: data.identifier }, { mobile: data.identifier }],
    },
  });

  if (!user || !user.password) {
    throw new Error("Invalid credentials");
  }

  const isValidPassword = await bcrypt.compare(data.password, user.password);

  if (!isValidPassword) {
    throw new Error("Invalid credentials");
  }

  const payload = { id: user.id, role: user.role };
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    },
  };
}

export async function refresh(data: z.infer<typeof RefreshTokenSchema>) {
  try {
    const decoded = jwt.verify(data.refreshToken, JWT_REFRESH_SECRET) as {
      id: number;
      role: string;
    };

    const user = await User.findByPk(decoded.id);

    if (!user || user.refreshToken !== data.refreshToken) {
      throw new Error("Invalid refresh token");
    }

    const payload = { id: user.id, role: user.role };
    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);
    const newRefreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    } as jwt.SignOptions);

    user.refreshToken = newRefreshToken;
    await user.save();

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  } catch (err) {
    throw new Error("Invalid refresh token");
  }
}
