import { NextFunction, Request, Response } from "express";
import { resolveSessionFromRequest, SessionUser } from "../modules/identity/service";

export interface AuthedRequest extends Request {
  authUser?: SessionUser;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const user = resolveSessionFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  req.authUser = user;
  next();
}

export function requireRoles(roles: SessionUser["role"][]) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    const user = resolveSessionFromRequest(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (!roles.includes(user.role)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    req.authUser = user;
    next();
  };
}

