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
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
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

export async function upload(req: Request, res: Response) {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  try {
    const type = req.params.type;
    const folder =
      type === "id"
        ? process.env.ID_PATH || "ids"
        : process.env.PHOTO_PATH || "photos";

    const url = `/uploads/${folder}/${req.file.filename}`;

    res.json({
      message:
        type === "id"
          ? "File uploaded and saved successfully"
          : "Photo uploaded and saved successfully",
      filename: req.file.filename,
      url,
    });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
}
