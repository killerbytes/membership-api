import express from "express";
import request from "supertest";
import { verifyToken } from "../../middlewares/verifyToken";
import authRoutes from "./auth.routes";
import * as authService from "./auth.service";

jest.mock("./auth.service", () => ({
  __esModule: true,
  login: jest
    .fn()
    .mockResolvedValue({ accessToken: "accToken", refreshToken: "refToken" }),
  refresh: jest
    .fn()
    .mockResolvedValue({ accessToken: "newAcc", refreshToken: "newRef" }),
}));

jest.mock("../user/user.service", () => ({
  __esModule: true,
  get: jest.fn().mockResolvedValue({ id: 1, email: "test" }),
}));

jest.mock("../../middlewares/verifyToken", () => ({
  verifyToken: jest.fn((req, res, next) => {
    req.user = { id: 1 };
    next();
  }),
}));

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("EXPRESS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
);

describe("Auth Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST /auth/login should call authService.login", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ identifier: "test", password: "pwd" });
    expect(authService.login).toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  it("POST /auth/refresh should call authService.refresh", async () => {
    const res = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: "token" });
    expect(authService.refresh).toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  it("GET /auth/current-user should return user", async () => {
    const res = await request(app).get("/auth/current-user");
    expect(verifyToken).toHaveBeenCalled();
    expect(res.status).toBe(200);
  });
});
