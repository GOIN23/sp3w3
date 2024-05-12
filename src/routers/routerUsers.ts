import express, { Request, Response } from "express";
import {  validaLoginPasswordEmail, validasearchLoginTerm, validasearchSearchEmailTerm } from "../validation/validationUsers";
import { validaError, validaQurePageSezi, validaQureSortBy, validaQureipageNumber, validaQursortDirection } from "../validation/generalvValidation";
import { usersService } from "../services/users-service";
import { SETTINGS } from "../seting/seting";
import { qrepostoryUsers } from "../repository/qreposttoryUsers";
import { authMiddleware } from "../auth/authMiddleware";
import { qureUsers } from "../types/typeUser";

export const routerUsers = () => {
  const router = express.Router();

  router.post("/", authMiddleware, validaLoginPasswordEmail, validaError, async (req: Request, res: Response) => {
    const newUser = await usersService.creatUsers(req.body);
    res.status(SETTINGS.HTTPCOD.HTTPCOD_201).send(newUser);
  });

  router.get(
    "/",
    validaQursortDirection,
    validaQurePageSezi,
    validaQureipageNumber,
    validaQureSortBy,
    validasearchLoginTerm,
    validasearchSearchEmailTerm,
    async (req: Request<{}, {}, {}, qureUsers>, res: Response) => {
      const result = await qrepostoryUsers.getUsers(req.query);

      res.status(SETTINGS.HTTPCOD.HTTPCOD_200).send(result);
      return;
    }
  );

  router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
    let result = await usersService.findUsers(req.params.id);
    if (!result) {
      res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
      return;
    }

    await usersService.deleteBlogs(req.params.id);
    res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_204);
    return;
  });

  return router;
};
