import { NextFunction, Request, Response } from "express";
import { MemberBaseSchema } from "./member.schema";
import * as memberService from "./member.service";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const validatedData = MemberBaseSchema.parse(req.body);

    if (!req.user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const result = await memberService.create({
      ...validatedData,
      userId: req.user.id,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }
    const member = await memberService.get(id);
    res.json(member);
  } catch (error) {
    next(error);
  }
}

export async function list(req: Request, res: Response) {
  const members = await memberService.list();
  res.json(members);
}
