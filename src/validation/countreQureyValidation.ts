import { authService } from "../composition/composition-rootAuth";
import { CustomRateLimitT } from "../types/generalType";
import { NextFunction, Request, Response } from "express";

export const countreQureyValidation = async (req: Request, res: Response, next: NextFunction) => {
  const metaData: CustomRateLimitT = {
    IP: req.ip,
    URL: req.originalUrl,
    date: new Date(),
  };


  const countreQurey = await authService.checkingNumberRequests(metaData);


  if (countreQurey >= 5) {
    res.sendStatus(429);
    return;
  }


  await authService.addRateLlimit(metaData);

  next();
};
