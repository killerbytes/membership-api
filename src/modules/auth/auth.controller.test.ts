import { Request, Response } from "express";
import * as userService from "../user/user.service";
import * as authController from "./auth.controller";
import * as authService from "./auth.service";

jest.mock("./auth.service", () => ({
  __esModule: true,
  login: jest.fn(),
  refresh: jest.fn(),
}));

jest.mock("../user/user.service", () => ({
  __esModule: true,
  get: jest.fn(),
  getAll: jest.fn(),
  create: jest.fn(),
}));

describe("Auth Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockCookie: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockCookie = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockReq = {
      body: {},
    };
    mockRes = {
      json: mockJson,
      cookie: mockCookie,
      status: mockStatus,
    };
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should set cookie and return accessToken on successful login", async () => {
      mockReq.body = { identifier: "test@test.com", password: "pwd" };
      (authService.login as jest.Mock).mockResolvedValue({
        accessToken: "accToken",
        refreshToken: "refToken",
      });

      await authController.login(mockReq as Request, mockRes as Response);

      expect(authService.login).toHaveBeenCalled();
      expect(mockCookie).toHaveBeenCalledWith(
        "refreshToken",
        "refToken",
        expect.any(Object)
      );
      expect(mockJson).toHaveBeenCalledWith({ accessToken: "accToken" });
    });
  });

  describe("refresh", () => {
    it("should set new cookie and return new accessToken", async () => {
      mockReq.body = { refreshToken: "oldToken" };
      (authService.refresh as jest.Mock).mockResolvedValue({
        accessToken: "newAccToken",
        refreshToken: "newRefToken",
      });

      await authController.refresh(mockReq as Request, mockRes as Response);

      expect(authService.refresh).toHaveBeenCalled();
      expect(mockCookie).toHaveBeenCalledWith(
        "refreshToken",
        "newRefToken",
        expect.any(Object)
      );
      expect(mockJson).toHaveBeenCalledWith({ accessToken: "newAccToken" });
    });
  });

  describe("getCurrentUser", () => {
    it("should return user if req.user is populated", async () => {
      mockReq.user = { id: 1, role: "user" } as any;
      const mockUser = { id: 1, email: "test@example.com" };
      (userService.get as jest.Mock).mockResolvedValue(mockUser);

      await authController.getCurrentUser(
        mockReq as Request,
        mockRes as Response
      );

      expect(userService.get).toHaveBeenCalledWith(1);
      expect(mockJson).toHaveBeenCalledWith(mockUser);
    });

    it("should return 401 if req.user is not populated", async () => {
      mockReq.user = undefined;

      await authController.getCurrentUser(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({ message: "Unauthorized" });
    });
  });
});
