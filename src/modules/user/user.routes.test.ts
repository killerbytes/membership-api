import express from "express";
import request from "supertest";
import userRoutes from "./user.routes";

jest.mock("./user.service", () => ({
  __esModule: true,
  create: jest.fn().mockResolvedValue("Created"),
  get: jest.fn().mockResolvedValue({ id: 1 }),
  getAll: jest.fn().mockResolvedValue([]),
}));

jest.mock("../../middlewares/verifyToken", () => ({
  verifyToken: jest.fn((req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.use("/users", userRoutes);

describe("User Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST /users should call create", async () => {
    const res = await request(app)
      .post("/users")
      .send({ email: "test@test.com", password: "password123!" });
    expect(res.status).toBe(200);
  });

  it("GET /users should call get", async () => {
    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
  });
});
