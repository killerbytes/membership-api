import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { verifyToken } from "./middlewares/verifyToken";
import authRoutes from "./modules/auth/auth.routes";
import locationRoutes from "./modules/location/location.routes";
import memberRoutes from "./modules/member/member.routes";
import userRoutes from "./modules/user/user.routes";

const app = express();

app.use(
  cors({
    origin: [
      ...(process.env.CLIENT_URL?.split(",") || "https://localhost:5173"),
    ],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));

import path from "path";

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/member", verifyToken, memberRoutes);
app.use("/api/location", verifyToken, locationRoutes);

app.get("/api", (req, res) => {
  res.json({
    test: true,
  });
});

app.use(errorHandler);

export default app;
