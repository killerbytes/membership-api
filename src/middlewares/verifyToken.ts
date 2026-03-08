import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const env = process.env.NODE_ENV || "development";
const envPath = `.env.${env}`;
require("dotenv").config({ path: envPath });

const JWT_SECRET = process.env.JWT_SECRET || "access_secret";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
