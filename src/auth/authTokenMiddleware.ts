import { NextFunction, Request, Response } from "express";
import { jwtService } from "../composition/composition-rootAuth";
import { usersService } from "../composition/composition-rootUsers";

export const authTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization as string;
  const refreshToken = req.cookies.refreshToken;


  if (!auth) {
    res.sendStatus(401);
    return;
  }

  const checkRefreshToken = await jwtService.checkRefreshToken(refreshToken);


  if (!checkRefreshToken) {
    res.sendStatus(401);

    return;
  }

  const token = req.headers.authorization!.split(" ")[1];

  console.log(token, "tokentoken tokentokentoken")
  const userId = await jwtService.getUserIdByToken(token);

  if (userId) {
    const user = await usersService.findUsers(userId.toString());
    req.userId = user?._id;
    next();
    return;
  }

  res.sendStatus(401);
};
