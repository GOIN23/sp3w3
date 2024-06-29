import jwt from "jsonwebtoken";
import { SETTINGS } from "./../seting/seting";
import { NextFunction, Request, Response } from "express";

export const determinIngUserLikeStatusMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization as string;

  if (!auth) {
    next();
    return;
  }

  const token = req.headers.authorization!.split(" ")[1];

  try {
    const userId: any = jwt.verify(token, SETTINGS.JWT_SECRET);
    req.userId = userId.userId;
    next();
  } catch (error) {
    next();
    return;
  }
};
