import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../user/user.model";
import * as authService from "./auth.service";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../user/user.model", () => ({
  User: {
    scope: jest.fn().mockReturnThis(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
  },
}));

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should return tokens and user for valid credentials", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        mobile: "1234567890",
        role: "user",
        password: "hashedPassword",
        save: jest.fn(),
      };
      (User.scope("withPassword").findOne as jest.Mock).mockResolvedValue(
        mockUser
      );
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock)
        .mockReturnValueOnce("accToken")
        .mockReturnValueOnce("refToken");

      const result = await authService.login({
        identifier: "test@example.com",
        password: "password",
      });

      expect(result.accessToken).toBe("accToken");
      expect(result.refreshToken).toBe("refToken");
      expect(result.user.email).toBe("test@example.com");
      expect(mockUser.save).toHaveBeenCalled();
    });

    it("should throw error for invalid credentials", async () => {
      (User.scope("withPassword").findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.login({ identifier: "test@test.com", password: "pwd" })
      ).rejects.toThrow("Invalid credentials");
    });
  });

  describe("refresh", () => {
    it("should return new tokens for valid refresh token", async () => {
      const mockUser = {
        id: 1,
        role: "user",
        refreshToken: "oldRefToken",
        save: jest.fn(),
      };
      (jwt.verify as jest.Mock).mockReturnValue({ id: 1, role: "user" });
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock)
        .mockReturnValueOnce("newAccToken")
        .mockReturnValueOnce("newRefToken");

      const result = await authService.refresh({ refreshToken: "oldRefToken" });

      expect(result.accessToken).toBe("newAccToken");
      expect(result.refreshToken).toBe("newRefToken");
      expect(mockUser.save).toHaveBeenCalled();
    });

    it("should throw error for invalid refresh token", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error();
      });

      await expect(
        authService.refresh({ refreshToken: "badToken" })
      ).rejects.toThrow("Invalid refresh token");
    });
  });
});
