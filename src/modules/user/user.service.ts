import { z } from "zod";
import { Member } from "../member/member.model";
import { User } from "./user.model";
import { UserBaseSchema } from "./user.schema";

export async function get(id: number) {
  return User.findByPk(id, {
    include: includes,
  });
}

export async function getAll() {
  return User.findAll({
    include: includes,
  });
}

export async function create(data: z.infer<typeof UserBaseSchema>) {
  await User.create(data as any);
  return "User created successfully";
}

const includes = [
  {
    model: Member,
    as: "member",
  },
];
