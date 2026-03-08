import { NextFunction, Request, Response } from "express";
import * as memberController from "./member.controller";
import * as memberService from "./member.service";

jest.mock("./member.service", () => ({
  __esModule: true,
  create: jest.fn(),
  get: jest.fn(),
  list: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

jest.mock("./member.schema", () => ({
  MemberBaseSchema: {
    parse: jest.fn((data) => {
      if (!data || Object.keys(data).length === 0)
        throw new Error("ValidationError");
      return data;
    }),
  },
}));

describe("Member Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockNext = jest.fn();
    mockReq = {
      body: {},
      params: {},
    };
    mockRes = {
      json: mockJson,
      status: mockStatus,
    };
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a member when valid data and user in req", async () => {
      mockReq.body = {
        firstName: "John",
        lastName: "Doe",
        address: "abc",
        mobile: "123",
      };
      mockReq.user = { id: 1, role: "user" } as any;
      const mockResult = { id: 1, firstName: "John", userId: 1 };
      (memberService.create as jest.Mock).mockResolvedValue(mockResult);

      await memberController.create(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(memberService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: "John",
          userId: 1,
        })
      );
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });

    it("should return 401 when no user in req", async () => {
      mockReq.body = {
        firstName: "John",
        lastName: "Doe",
        address: "abc",
        mobile: "123",
      };
      mockReq.user = undefined;

      await memberController.create(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({ message: "Unauthorized" });
      expect(memberService.create).not.toHaveBeenCalled();
    });

    it("should call next with error if validation fails", async () => {
      mockReq.body = {};

      await memberController.create(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error)); // ZodError
    });
  });

  describe("get", () => {
    it("should return member by id", async () => {
      mockReq.params = { id: "1" };
      const mockMember = { id: 1, firstName: "John" };
      (memberService.get as jest.Mock).mockResolvedValue(mockMember);

      await memberController.get(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(memberService.get).toHaveBeenCalledWith(1);
      expect(mockJson).toHaveBeenCalledWith(mockMember);
    });

    it("should return 400 for invalid ID format", async () => {
      mockReq.params = { id: "invalid" };

      await memberController.get(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: "Invalid ID format" });
    });

    it("should pass error to next if service throws", async () => {
      mockReq.params = { id: "1" };
      const mockError = new Error("Not Found");
      (memberService.get as jest.Mock).mockRejectedValue(mockError);

      await memberController.get(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("list", () => {
    it("should return all members", async () => {
      const mockMembers = [{ id: 1 }];
      (memberService.list as jest.Mock).mockResolvedValue(mockMembers);

      await memberController.list(mockReq as Request, mockRes as Response);

      expect(memberService.list).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(mockMembers);
    });
  });
});
