import express, { Request, Response } from "express";
import { usersService } from "../services/users-service";
import { SETTINGS } from "../seting/seting";
import { validaEmail, validaLoginPasswordEmail, validaPassword, validaloginOrEmail } from "../validation/validationUsers";
import { jwtService } from "./application/jwtService";
import { authTokenMiddleware } from "../auth/authTokenMiddleware";
import { validaError } from "../validation/generalvValidation";
import { authService } from "../services/auth-service";

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

  router.post("/registration", validaLoginPasswordEmail, validaError, async (req: Request, res: Response) => {
    const user = authService.findBlogOrEmail(req.body);

    if (!user) {
      res.sendStatus(400);
      return;
    }
    await authService.creatUser(req.body);

    res.sendStatus(200);
  });

  router.post("/registration-confirmation", validaError, async (req: Request, res: Response) => {
    const result = await authService.confirmEmail(req.body.code);

    if (!result) {
      res.sendStatus(400);
      return;
    }

    res.sendStatus(200);
  });

  router.post("/registration-email-resending", validaEmail, validaError, async (req: Request, res: Response) => {
    const result = await authService.resendingCode(req.body.email);

    if (!result) {
      res.sendStatus(400);
      return;
    }

    res.sendStatus(200);
  });

  router.get("/me", authTokenMiddleware, async (req: Request, res: Response) => {
    // @ts-ignore
    const user = await usersService.findUsers(req.userId);
    res.status(200).send({ email: user?.email, login: user?.login, userId: req.userId });
  });

  return router;
};
