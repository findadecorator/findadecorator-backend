import { NextFunction, Request, Response } from "express";

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) {
    return {};
  }
  return cookieHeader.split(";").reduce<Record<string, string>>((acc, pair) => {
    const idx = pair.indexOf("=");
    if (idx === -1) {
      return acc;
    }
    const key = pair.slice(0, idx).trim();
    const value = decodeURIComponent(pair.slice(idx + 1).trim());
    acc[key] = value;
    return acc;
  }, {});
}

export function cookieParser(req: Request, _res: Response, next: NextFunction) {
  (req as Request & { cookies?: Record<string, string> }).cookies = parseCookies(req.headers.cookie);
  next();
}

