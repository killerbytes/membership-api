import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { verifyToken } from "./middlewares/verifyToken";
import authRoutes from "./modules/auth/auth.routes";
import locationRoutes from "./modules/location/location.routes";
import memberRoutes from "./modules/member/member.routes";
import userRoutes from "./modules/user/user.routes";

const app = express();
const env = process.env.NODE_ENV || "development";

app.use(
  cors({
    origin: ["https://192.168.0.69:5173"],
    credentials: true,
  })
); // Enable CORS for all routes

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

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
