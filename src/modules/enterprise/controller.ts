import { Request, Response } from "express";
import { getEnterprisePlan } from "./service";

export function enterpriseController(_req: Request, res: Response) {
  res.json(getEnterprisePlan());
}
