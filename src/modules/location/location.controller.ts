import { Request, Response } from "express";
import * as userService from "./location.service";

export async function getCities(req: Request, res: Response) {
  const cities = await userService.getCities();
  res.json(cities);
}

export async function getBarangays(req: Request, res: Response) {
  const { code } = req.params;
  const barangays = await userService.getBarangays(code as string);
  res.json(barangays);
}
