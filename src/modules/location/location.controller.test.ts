import { Request, Response } from "express";
import * as locationController from "./location.controller";
import * as locationService from "./location.service";

jest.mock("./location.service", () => ({
  __esModule: true,
  getCities: jest.fn(),
  getBarangays: jest.fn(),
}));

describe("Location Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockReq = { params: {} };
    mockRes = { json: mockJson };
    jest.clearAllMocks();
  });

  describe("getCities", () => {
    it("should return cities from service", async () => {
      const mockCities = [{ name: "City", code: "1" }];
      (locationService.getCities as jest.Mock).mockResolvedValue(mockCities);

      await locationController.getCities(
        mockReq as Request,
        mockRes as Response
      );

      expect(locationService.getCities).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(mockCities);
    });
  });

  describe("getBarangays", () => {
    it("should return barangays for a given code", async () => {
      mockReq.params = { code: "123" };
      const mockBarangays = [{ name: "Brgy", code: "2" }];
      (locationService.getBarangays as jest.Mock).mockResolvedValue(
        mockBarangays
      );

      await locationController.getBarangays(
        mockReq as Request,
        mockRes as Response
      );

      expect(locationService.getBarangays).toHaveBeenCalledWith("123");
      expect(mockJson).toHaveBeenCalledWith(mockBarangays);
    });
  });
});
