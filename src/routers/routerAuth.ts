import express, { Request, Response } from "express";
import { usersService } from "../services/users-service";
import { SETTINGS } from "../seting/seting";
import { validaPassword, validaloginOrEmail } from "../validation/validationUsers";
import { jwtService } from "./application/jwtService";
import { authTokenMiddleware } from "../auth/authTokenMiddleware";
import { validaError } from "../validation/generalvValidation";

export const routerAuth = () => {
  const router = express.Router();

  router.post("/login", validaloginOrEmail, validaPassword, validaError, async (req: Request, res: Response) => {
    const user = await usersService.checkCreadentlais(req.body.loginOrEmail, req.body.password);
    if (user) {
      const token = await jwtService.createJwt(user);
      res.status(SETTINGS.HTTPCOD.HTTPCOD_200).send(token);
      return;
    } else {
      res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_401);
      return;
    }
  });

  router.get("/me", authTokenMiddleware, async (req: Request, res: Response) => {
    // @ts-ignore
    const user = await usersService.findUsers(req.userId);
    res.status(200).send({ email: user?.email, login: user?.login, userId: req.userId });
  });

  return router;
};
