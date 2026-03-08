import sequelize from "../../config/database";
import { Member } from "./member.model";
import * as memberService from "./member.service";

jest.mock("../../config/database");

jest.mock("./member.model", () => ({
  Member: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
  },
}));

jest.mock("../user/user.model", () => ({
  User: {
    findByPk: jest.fn(),
  },
}));

describe("Member Service", () => {
  let mockTransaction: any;

  beforeEach(() => {
    mockTransaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    };
    (sequelize.transaction as jest.Mock).mockResolvedValue(mockTransaction);
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should successfully create a member and commit transaction", async () => {
      const mockData = { firstName: "Test Member", userId: 1 };
      const mockMember = { id: 1, ...mockData };
      (Member.create as jest.Mock).mockResolvedValue(mockMember);

      const result = await memberService.create(mockData as any);

      expect(sequelize.transaction).toHaveBeenCalled();
      expect(Member.create).toHaveBeenCalledWith(mockData, {
        transaction: mockTransaction,
      });
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(result).toEqual(mockMember);
    });

    it("should rollback transaction on error", async () => {
      const mockData = { name: "Test Member", userId: 1 };
      (Member.create as jest.Mock).mockRejectedValue(new Error("DB Error"));

      await expect(memberService.create(mockData as any)).rejects.toThrow(
        "DB Error"
      );

      expect(sequelize.transaction).toHaveBeenCalled();
      expect(Member.create).toHaveBeenCalledWith(mockData, {
        transaction: mockTransaction,
      });
      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(mockTransaction.commit).not.toHaveBeenCalled();
    });
  });

  describe("get", () => {
    it("should return member when found", async () => {
      const mockMember = { id: 1, firstName: "Test Member" };
      (Member.findByPk as jest.Mock).mockResolvedValue(mockMember);

      const result = await memberService.get(1);

      expect(Member.findByPk).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          include: expect.arrayContaining([
            expect.objectContaining({ as: "user" }),
          ]),
        })
      );
      expect(result).toEqual(mockMember);
    });

    it("should throw error when member not found", async () => {
      (Member.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(memberService.get(1)).rejects.toThrow("Member Not Found");
    });
  });

  describe("update", () => {
    it("should update and return member", async () => {
      const mockMember = {
        id: 1,
        firstName: "Old Name",
        update: jest.fn().mockResolvedValue({ id: 1, firstName: "New Name" }),
      };
      (Member.findByPk as jest.Mock).mockResolvedValue(mockMember);

      const result = await memberService.update(1, {
        firstName: "New Name",
      } as any);

      expect(Member.findByPk).toHaveBeenCalledWith(1);
      expect(mockMember.update).toHaveBeenCalledWith({ firstName: "New Name" });
      expect(result.firstName).toBe("New Name");
    });

    it("should throw error if member not found", async () => {
      (Member.findByPk as jest.Mock).mockResolvedValue(null);
      await expect(
        memberService.update(1, { firstName: "New Name" } as any)
      ).rejects.toThrow("Member not found");
    });
  });

  describe("remove", () => {
    it("should destroy and return member", async () => {
      const mockMember = { id: 1, destroy: jest.fn().mockResolvedValue(true) };
      (Member.findByPk as jest.Mock).mockResolvedValue(mockMember);

      const result = await memberService.remove(1);

      expect(Member.findByPk).toHaveBeenCalledWith(1);
      expect(mockMember.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe("list", () => {
    it("should return all members", async () => {
      const mockMembers = [{ id: 1 }];
      (Member.findAll as jest.Mock).mockResolvedValue(mockMembers);

      const result = await memberService.list();

      expect(Member.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockMembers);
    });
  });
});
