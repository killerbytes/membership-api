import { User } from "./user.model";
import * as userService from "./user.service";

// Mock the User model
jest.mock("./user.model", () => ({
  User: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("../member/member.model", () => ({
  Member: {},
}));

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("get", () => {
    it("should call User.findByPk with correct parameters", async () => {
      const mockId = 1;
      const mockResult = { id: mockId, email: "test@example.com" };
      (User.findByPk as jest.Mock).mockResolvedValue(mockResult);

      const result = await userService.get(mockId);

      expect(User.findByPk).toHaveBeenCalledWith(
        mockId,
        expect.objectContaining({
          include: expect.arrayContaining([
            expect.objectContaining({ as: "member" }),
          ]),
        })
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe("getAll", () => {
    it("should call User.findAll with correct parameters", async () => {
      const mockResult = [{ id: 1, email: "test@example.com" }];
      (User.findAll as jest.Mock).mockResolvedValue(mockResult);

      const result = await userService.getAll();

      expect(User.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.arrayContaining([
            expect.objectContaining({ as: "member" }),
          ]),
        })
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe("create", () => {
    it("should call User.create and return success message", async () => {
      const mockData = { email: "test@example.com", password: "password123" };
      (User.create as jest.Mock).mockResolvedValue(mockData);

      const result = await userService.create(mockData);

      expect(User.create).toHaveBeenCalledWith(mockData);
      expect(result).toBe("User created successfully");
    });
  });
});
