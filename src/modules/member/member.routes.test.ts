import express from "express";
import request from "supertest";
import memberRoutes from "./member.routes";

jest.mock("./member.service", () => ({
  __esModule: true,
  create: jest.fn().mockResolvedValue({ id: 1 }),
  get: jest.fn().mockResolvedValue({ id: 1 }),
  list: jest.fn().mockResolvedValue([]),
}));

jest.mock("./member.schema", () => ({
  MemberBaseSchema: {
    parse: jest.fn((data) => data),
  },
}));

const app = express();
app.use(express.json());
// Add a middleware to mock req.user for create
app.use((req, res, next) => {
  req.user = { id: 1, role: "user" };
  next();
});
app.use("/members", memberRoutes);

describe("Member Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /members/:id should call get", async () => {
    const res = await request(app).get("/members/1");
    expect(res.status).toBe(200);
  });

  it("GET /members should call list", async () => {
    const res = await request(app).get("/members");
    expect(res.status).toBe(200);
  });

  it("POST /members/register should call create", async () => {
    const res = await request(app).post("/members/register").send({
      firstName: "John",
      lastName: "Doe",
      address: "abc",
      mobile: "123",
    });
    expect(res.status).toBe(200);
  });
});
