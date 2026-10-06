import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/AppError.ts";
import jwt from "jsonwebtoken";
export interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new AppError(401, "Invalid or missing authorization header.");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string,
    ) as {
      userId: string;
      role: string;
    };

    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError(401, "Access token expired. Please refresh.");
    }

    throw new AppError(401, "Invalid access token.");
  }
};
