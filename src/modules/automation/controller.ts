import { Request, Response } from "express";
import { getAutomationFlows } from "./service";

export function automationController(_req: Request, res: Response) {
  res.json(getAutomationFlows());
}
