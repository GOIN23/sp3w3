import { NextFunction, Request, Response } from "express";
import { jwtService } from "../composition/composition-rootAuth";

export const authTokenAccessTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization as string;

  if (!accessToken) {
    res.sendStatus(401);
    return;
  }

  const token = req.headers.authorization!.split(" ")[1];

  const checkAccessToken = await jwtService.checkAccessToken(token);

  if (!checkAccessToken) {
    res.sendStatus(401);
    return;
  }

  req.userId = checkAccessToken?.userId;
  next();
};
