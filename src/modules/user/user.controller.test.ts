import { Request, Response } from "express";
import * as userController from "./user.controller";
import * as userService from "./user.service";

jest.mock("./user.service", () => ({
  __esModule: true,
  get: jest.fn(),
  getAll: jest.fn(),
  create: jest.fn(),
}));

describe("User Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockReq = {};
    mockRes = {
      json: mockJson,
    };
    jest.clearAllMocks();
  });

  describe("get", () => {
    it("should call userService.get and res.json with the user", async () => {
      mockReq.params = { id: "1" };
      const mockUser = { id: 1, email: "test@example.com" };
      (userService.get as jest.Mock).mockResolvedValue(mockUser);

      await userController.get(mockReq as Request, mockRes as Response);

      expect(userService.get).toHaveBeenCalledWith(1);
      expect(mockJson).toHaveBeenCalledWith(mockUser);
    });
  });

  describe("getAll", () => {
    it("should call userService.getAll and res.json with users", async () => {
      const mockUsers = [{ id: 1, email: "test@example.com" }];
      (userService.getAll as jest.Mock).mockResolvedValue(mockUsers);

      await userController.getAll(mockReq as Request, mockRes as Response);

      expect(userService.getAll).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(mockUsers);
    });
  });

  describe("create", () => {
    it("should validate default data, call userService.create, and res.json", async () => {
      const validData = { email: "test@example.com", password: "password123" };
      mockReq.body = validData;
      (userService.create as jest.Mock).mockResolvedValue(
        "User created successfully"
      );

      await userController.create(mockReq as Request, mockRes as Response);

      expect(userService.create).toHaveBeenCalledWith(
        expect.objectContaining(validData)
      );
      expect(mockJson).toHaveBeenCalledWith("User created successfully");
    });

    it("should throw an error for invalid data", async () => {
      const invalidData = { email: "test@example.com" }; // missing password
      mockReq.body = invalidData;

      await expect(
        userController.create(mockReq as Request, mockRes as Response)
      ).rejects.toThrow();

      expect(userService.create).not.toHaveBeenCalled();
    });
  });
});
