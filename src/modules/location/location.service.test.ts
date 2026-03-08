import { barangays, cities } from "select-philippines-address";
import * as locationService from "./location.service";

jest.mock("select-philippines-address", () => ({
  cities: jest.fn(),
  barangays: jest.fn(),
}));

describe("Location Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCities", () => {
    it("should fetch cities and map response correctly", async () => {
      const mockCities = [{ city_name: "Test City", city_code: "123" }];
      (cities as jest.Mock).mockResolvedValue(mockCities);

      const result = await locationService.getCities();

      expect(cities).toHaveBeenCalledWith("0349");
      expect(result).toEqual([{ name: "Test City", code: "123" }]);
    });
  });

  describe("getBarangays", () => {
    it("should fetch barangays by code and map response", async () => {
      const mockBarangays = [{ brgy_name: "Test Brgy", brgy_code: "456" }];
      (barangays as jest.Mock).mockResolvedValue(mockBarangays);

      const result = await locationService.getBarangays("123");

      expect(barangays).toHaveBeenCalledWith("123");
      expect(result).toEqual([{ name: "Test Brgy", code: "456" }]);
    });
  });
});
