import { z } from "zod";
import sequelize from "../../config/database";
import { User } from "../user/user.model";
import { Member } from "./member.model";
import { MemberBaseSchema } from "./member.schema";

export async function create(
  data: z.infer<typeof MemberBaseSchema> & { userId: number }
) {
  const user: (User & { member?: Member }) | null = await User.findByPk(
    data.userId,
    {
      include: [
        {
          model: Member,
          as: "member",
        },
      ],
    }
  );

  if (user?.member) {
    throw new Error("User is already a member");
  }
  const transaction = await sequelize.transaction();
  try {
    const member = await Member.create(data as any, { transaction });
    await transaction.commit();

    return member;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function get(id: string) {
  try {
    const member = await Member.findOne({
      where: {
        userId: id,
      },
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });
    if (!member) {
      throw new Error("Member Not Found");
    }
    return member;
  } catch (error) {
    throw error;
  }
}

export async function update(
  id: number,
  data: z.infer<typeof MemberBaseSchema>
) {
  const member = await Member.findByPk(id);
  if (!member) {
    throw new Error("Member not found");
  }
  return member.update(data as any);
}

export async function remove(id: number) {
  const member = await Member.findByPk(id);
  if (!member) {
    throw new Error("Member not found");
  }
  return member.destroy();
}

export async function list() {
  return Member.findAll({
    include: [
      {
        model: User,
        as: "user",
      },
    ],
  });
}
