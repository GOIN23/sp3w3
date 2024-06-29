import { NextFunction, Request, Response } from "express";
import { jwtService } from "../composition/composition-rootAuth";

export const authRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.sendStatus(401);
    return;
  }
  
  const checkRefreshToken = await jwtService.checkRefreshToken(refreshToken);


  if (!checkRefreshToken) {
    res.sendStatus(401);

    return;
  }

  next();
};
