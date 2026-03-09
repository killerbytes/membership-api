import { NextFunction, Request, Response } from "express";
import { MemberBaseSchema } from "./member.schema";
import * as memberService from "./member.service";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body;

    const newPayload = {
      ...payload,
      currentAddress1: payload.permanentAddress1,
      currentAddress2: payload.permanentAddress2,
      currentBarangay: payload.permanentBarangay,
      currentCity: payload.permanentCity,
    };

    const validatedData = MemberBaseSchema.parse(
      payload.currentAddress ? newPayload : req.body
    );

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
    const member = await memberService.get(req.params.id);
    res.json(member);
  } catch (error) {
    next(error);
  }
}

export async function list(req: Request, res: Response) {
  const members = await memberService.list();
  res.json(members);
}
