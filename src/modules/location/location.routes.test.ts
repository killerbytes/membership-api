import express from "express";
import request from "supertest";
import locationRoutes from "./location.routes";

jest.mock("./location.service", () => ({
  __esModule: true,
  getCities: jest.fn().mockResolvedValue([{ name: "City", code: "1" }]),
  getBarangays: jest.fn().mockResolvedValue([{ name: "Brgy", code: "2" }]),
}));

const app = express();
app.use(express.json());
app.use("/locations", locationRoutes);

describe("Location Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /locations/cities should return cities", async () => {
    const res = await request(app).get("/locations/cities");
    expect(res.status).toBe(200);
  });

  it("GET /locations/barangays/:code should return barangays", async () => {
    const res = await request(app).get("/locations/barangays/123");
    expect(res.status).toBe(200);
  });
});
