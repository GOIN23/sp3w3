import express, { Request, Response } from "express";
import { postsService } from "../services/posts-service";
import { SETTINGS } from "../seting/seting";
import { validaCommentPost } from "../validation/validationsPostst";
import { validaError } from "../validation/generalvValidation";
import { authTokenMiddleware } from "../auth/authTokenMiddleware";

export const routerComments = () => {
  const router = express.Router();

  router.get("/:id", async (req: Request, res: Response) => {
    const result = await postsService.findCommentPosts(req.params.id);

    if (!result) {
      res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
      return;
    }

    res.status(SETTINGS.HTTPCOD.HTTPCOD_200).send(result);
    return;
  });

  router.put("/:id", authTokenMiddleware, validaCommentPost, validaError, async (req: Request, res: Response) => {
    const resul = await postsService.findCommentPosts(req.params.id);

    if (!resul) {
      res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
      return;
    }

    if (resul.commentatorInfo.userId !== req.userId) {
      res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_403);
      return;
    }

    await postsService.updateCommentPosts(req.body, req.params.id);

    res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_204);
    return;
  });

  router.delete("/:id", authTokenMiddleware, async (req: Request, res: Response) => {
    const resul = await postsService.findCommentPosts(req.params.id);

    if (!resul) {
      res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
      return;
    }

    if (resul.commentatorInfo.userId !== req.userId) {
      res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_403);
      return;
    }

    await postsService.deleteCommentPosts(req.params.id);

    res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_204);
    return;
  });
  
  return router;
};
