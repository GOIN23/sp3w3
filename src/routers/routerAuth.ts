import express, { Request, Response } from "express";
import { usersService } from "../services/users-service";
import { SETTINGS } from "../seting/seting";
import { validaEmail, validaLoginPasswordEmail, validaPassword, validaloginOrEmail } from "../validation/validationUsers";
import { jwtService } from "./application/jwtService";
import { authTokenMiddleware } from "../auth/authTokenMiddleware";
import { validaError } from "../validation/generalvValidation";
import { authService } from "../services/auth-service";
import { validabAuthdCodeCustm, validabAuthdEmailCustm, validabAuthdLoginCustm, validabAuthdresendingCodeCustm } from "../validation/validatAuth";

export const routerAuth = () => {
  const router = express.Router();

  router.post("/login", validaloginOrEmail, validaPassword, validaError, async (req: Request, res: Response) => {
    const user = await usersService.checkCreadentlais(req.body.loginOrEmail, req.body.password);
    if (user) {
      const { accessToken, refreshToken } = await jwtService.createJwt(user._id);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
      });
      res.status(SETTINGS.HTTPCOD.HTTPCOD_200).send({accessToken:accessToken});
      return;
    } else {
      res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_401);
      return;
    }
  });

  router.post("/registration", validaLoginPasswordEmail, validabAuthdLoginCustm, validabAuthdEmailCustm, validaError, async (req: Request, res: Response) => {
    await authService.creatUser(req.body);

    res.status(204).send("Input data is accepted. Email with confirmation code will be send to passed email address");
  });

  router.post("/registration-confirmation", validabAuthdCodeCustm, validaError, async (req: Request, res: Response) => {
    res.sendStatus(204);
    return;
  });

  router.post("/registration-email-resending", validaEmail, validabAuthdresendingCodeCustm, validaError, async (req: Request, res: Response) => {
    res.sendStatus(204);
    return;
  });

  router.get("/me", authTokenMiddleware, async (req: Request, res: Response) => {
    // @ts-ignore
    const user = await usersService.findUsers(req.userId);
    res.status(200).send({ email: user?.email, login: user?.login, userId: req.userId });
  });

  router.post("/refresh-token", async (req: Request, res: Response) => {
    const refreshToken: string = req.cookies.refreshToken;

    const JWT = await jwtService.updateToken(refreshToken);

    if (!JWT) {
      res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_401);
      return;
    }
    res.cookie("refreshToken", JWT.refreshToken, {
      httpOnly: true,
    });
    res.status(SETTINGS.HTTPCOD.HTTPCOD_200).send({accessToken:JWT.accessToken});
  });

  return router;
};
