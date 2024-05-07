import { qureT } from "./../types/generalType";
import express, { Request, Response } from "express";
import { SETTINGS } from "../seting/seting";
import { validaDescriptionBlogs, validaNameBlogs, validaWebsiteUrlBlogs } from "../validation/validationBlogs";
import { validationResult } from "express-validator";
import { errorValid } from "../utilt/errors";
import { authMiddleware } from "../auth/authMiddleware";
import { blogsService } from "../services/blogs-service";
import { qreposttoryBlogs } from "../repository/qreposttoryBlogs";
import { postsService } from "../services/posts-service";
import { validaContentPosts, validaShortDescriptionPosts, validaTitlePosts, validablogIdPostsCustm } from "../validation/validationsPostst";
import { validaQurePageSezi, validaQureSortBy, validaQureipageNumber, validaQursortDirection, validaSearchNameTerm } from "../validation/generalvValidation";

export const routerBlogs = () => {
  const router = express.Router();

  router.get(
    "/",
    validaQursortDirection,
    validaQurePageSezi,
    validaQureipageNumber,
    validaSearchNameTerm,
    validaQureSortBy,
    async (req: Request<{}, {}, {}, qureT>, res: Response) => {
      let result = await qreposttoryBlogs.getBlogs(req.query);

      res.status(SETTINGS.HTTPCOD.HTTPCOD_200).send(result);
      return;
    }
  );

  router.post("/", authMiddleware, validaNameBlogs, validaDescriptionBlogs, validaWebsiteUrlBlogs, async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send(errorValid(errors.array({ onlyFirstError: true })));
      return;
    }
    

    let newBlog = await blogsService.createBlogs(req.body);

    res.status(SETTINGS.HTTPCOD.HTTPCOD_201).send(newBlog);
  });

  router.post("/:id/posts", authMiddleware, validaTitlePosts, validaShortDescriptionPosts, validaContentPosts, async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send(errorValid(errors.array({ onlyFirstError: true })));
      return;
    }
    let result = await blogsService.findBlogs(req.params.id);

    if (!result) {
      res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
      return;
    }

    let newBlog = await postsService.creatPosts(req.body, req.params.id);

    res.status(SETTINGS.HTTPCOD.HTTPCOD_201).send(newBlog);
  });

  router.get("/:id", async (req: Request, res: Response) => {
    let result = await blogsService.findBlogs(req.params.id);

    if (!result) {
      res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
      return;
    }
    res.status(SETTINGS.HTTPCOD.HTTPCOD_200).send(result);
  });

  router.get(
    "/:id/posts",
    validaQursortDirection,
    validaQurePageSezi,
    validaQureipageNumber,
    validaSearchNameTerm,
    validaQureSortBy,
    async (req: Request, res: Response) => {
      let result = await blogsService.findBlogs(req.params.id);

      if (!result) {
        res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
        return;
      }

      const resultq = await qreposttoryBlogs.getBlogsPosts(req.query, req.params.id);

      res.status(SETTINGS.HTTPCOD.HTTPCOD_200).send(resultq);
    }
  );

  router.put("/:id", authMiddleware, validaNameBlogs, validaDescriptionBlogs, validaWebsiteUrlBlogs, async (req: Request, res: Response) => {
    let result = await blogsService.findBlogs(req.params.id);
    if (!result) {
      res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
      return;
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(errorValid(errors.array({ onlyFirstError: true })));
      return;
    }

    await blogsService.updatBlogs(req.body, req.params.id);
    res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_204);
    return;
  });

  router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
    let result = await blogsService.findBlogs(req.params.id);
    if (!result) {
      res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
      return;
    }

    await blogsService.deleteBlogs(req.params.id);

    res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_204);
    return;
  });

  return router;
};
