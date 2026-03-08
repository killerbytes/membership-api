import { Request, Response } from "express";
import { UserBaseSchema } from "./user.schema";
import * as userService from "./user.service";

export async function get(req: Request, res: Response) {
  const user = await userService.get(Number(req.params.id));
  res.json(user);
}

export async function getAll(req: Request, res: Response) {
  const users = await userService.getAll();
  res.json(users);
}

export async function create(req: Request, res: Response) {
  const validatedData = UserBaseSchema.parse(req.body);
  const user = await userService.create(validatedData);
  res.json(user);
}
